import { useNostr } from '@nostrify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import { useNostrPublish } from './useNostrPublish';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';
import type { DocumentEvent } from './useDocuments';
import { createDocumentNaddr } from '@/lib/documentUtils';

export interface CommentEvent extends NostrEvent {
  kind: 1111;
}

export function useComments(document: DocumentEvent, options?: { enabled?: boolean }) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['comments', document.id],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      // For addressable events (30023, 30024), we need to query by 'a' tag
      const naddr = createDocumentNaddr(document);
      
      const filter: NostrFilter = {
        kinds: [1111],
        '#A': [naddr], // Root scope for addressable events
        limit: 500,
      };
      
      const events = await nostr.query([filter], { signal });
      const comments = events as CommentEvent[];
      
      // Sort by creation time (oldest first for better threading)
      return comments.sort((a, b) => a.created_at - b.created_at);
    },
    enabled: !!document && (options?.enabled !== false),
  });
}

export function useCommentCount(document: DocumentEvent) {
  const commentsQuery = useComments(document);
  
  return {
    ...commentsQuery,
    data: commentsQuery.data?.length || 0,
  };
}

export function useCreateComment() {
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      document, 
      content, 
      parentComment 
    }: { 
      document: DocumentEvent; 
      content: string;
      parentComment?: CommentEvent;
    }) => {
      if (!user) {
        throw new Error('Must be logged in to comment');
      }

      if (!content.trim()) {
        throw new Error('Comment content cannot be empty');
      }

      const naddr = createDocumentNaddr(document);
      
      const tags: string[][] = [
        // Root scope tags (uppercase)
        ['A', naddr], // Root addressable event
        ['K', document.kind.toString()], // Root kind
        ['P', document.pubkey], // Root author
      ];

      if (parentComment) {
        // Reply to a comment
        tags.push(
          ['e', parentComment.id, '', parentComment.pubkey], // Parent comment
          ['k', '1111'], // Parent kind
          ['p', parentComment.pubkey] // Parent author
        );
      } else {
        // Top-level comment
        tags.push(
          ['a', naddr], // Parent is same as root for top-level
          ['e', document.id, '', document.pubkey], // Include event id for addressable events
          ['k', document.kind.toString()], // Parent kind same as root
          ['p', document.pubkey] // Parent author same as root
        );
      }

      return new Promise<CommentEvent>((resolve, reject) => {
        publishEvent({
          kind: 1111,
          content: content.trim(),
          tags,
        }, {
          onSuccess: (event) => {
            resolve(event as CommentEvent);
          },
          onError: reject,
        });
      });
    },
    onSuccess: (_, { document }) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({
        queryKey: ['comments', document.id],
      });
    },
  });
}