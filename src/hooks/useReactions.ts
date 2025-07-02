import { useNostr } from '@nostrify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import { useNostrPublish } from './useNostrPublish';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';
import type { DocumentEvent } from './useDocuments';

export interface ReactionEvent extends NostrEvent {
  kind: 7;
}

export function useReactions(eventId: string, _eventPubkey: string, options?: { enabled?: boolean }) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['reactions', eventId],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      const filter: NostrFilter = {
        kinds: [7],
        '#e': [eventId],
        limit: 1000,
      };
      
      const events = await nostr.query([filter], { signal });
      const reactions = events as ReactionEvent[];
      
      // Count likes (+ or empty content) and group by pubkey to avoid duplicates
      const likesByPubkey = new Map<string, ReactionEvent>();
      
      reactions.forEach(reaction => {
        const content = reaction.content.trim();
        if (content === '+' || content === '') {
          // Only keep the most recent like from each pubkey
          const existing = likesByPubkey.get(reaction.pubkey);
          if (!existing || reaction.created_at > existing.created_at) {
            likesByPubkey.set(reaction.pubkey, reaction);
          }
        }
      });
      
      return {
        reactions,
        likes: Array.from(likesByPubkey.values()),
        likeCount: likesByPubkey.size,
      };
    },
    enabled: !!eventId && (options?.enabled !== false),
  });
}

export function useUserReaction(eventId: string) {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['user-reaction', eventId, user?.pubkey],
    queryFn: async (c) => {
      if (!user?.pubkey) return null;
      
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      const filter: NostrFilter = {
        kinds: [7],
        '#e': [eventId],
        authors: [user.pubkey],
        limit: 1,
      };
      
      const events = await nostr.query([filter], { signal });
      return events[0] as ReactionEvent | undefined;
    },
    enabled: !!eventId && !!user?.pubkey,
  });
}

export function useLikeDocument() {
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ document, isLiked }: { document: DocumentEvent; isLiked: boolean }) => {
      if (!user) {
        throw new Error('Must be logged in to like documents');
      }

      if (isLiked) {
        // Unlike: publish a reaction with "-" content
        publishEvent({
          kind: 7,
          content: '-',
          tags: [
            ['e', document.id, '', document.pubkey],
            ['p', document.pubkey],
            ['k', document.kind.toString()],
          ],
        });
      } else {
        // Like: publish a reaction with "+" content
        publishEvent({
          kind: 7,
          content: '+',
          tags: [
            ['e', document.id, '', document.pubkey],
            ['p', document.pubkey],
            ['k', document.kind.toString()],
          ],
        });
      }
    },
    onSuccess: (_, { document }) => {
      // Invalidate reactions query to refetch
      queryClient.invalidateQueries({
        queryKey: ['reactions', document.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-reaction', document.id],
      });
    },
  });
}