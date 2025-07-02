import { useNostr } from '@nostrify/react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';
import { nip19 } from 'nostr-tools';

export interface DocumentEvent extends NostrEvent {
  kind: 30023 | 30024;
}
// Nostr npub converted to hex
const ANGOR_NPUB = 'npub1wrzguj625auyeysfuuxzf7ywhzlwfz9gm3fml2lul72gwqxw8n9swtcm02';
const ANGOR_PUBKEY = nip19.decode(ANGOR_NPUB).data as string;

export function useDocuments(filterType: 'all' | 'connections' | 'angor' = 'all', followedPubkeys: string[] = []) {
  const { nostr } = useNostr();

  return useInfiniteQuery({
    queryKey: ['documents', filterType, followedPubkeys],
    queryFn: async ({ pageParam, signal }) => {
      const abortSignal = AbortSignal.any([signal, AbortSignal.timeout(5000)]);
      
      let filters: NostrFilter[] = [];
      
      if (filterType === 'connections' && followedPubkeys.length > 0) {
        // Query documents from followed users only
        const baseFilter = { authors: followedPubkeys, limit: 20 };
        if (pageParam) {
          filters = [
            { kinds: [30023], ...baseFilter, until: pageParam },
            { kinds: [30024], ...baseFilter, until: pageParam }
          ];
        } else {
          filters = [
            { kinds: [30023], ...baseFilter },
            { kinds: [30024], ...baseFilter }
          ];
        }
      } else if (filterType === 'angor') {
        // Query documents from Nostr only
        const baseFilter = { authors: [ANGOR_PUBKEY], limit: 20 };
        if (pageParam) {
          filters = [
            { kinds: [30023], ...baseFilter, until: pageParam },
            { kinds: [30024], ...baseFilter, until: pageParam }
          ];
        } else {
          filters = [
            { kinds: [30023], ...baseFilter },
            { kinds: [30024], ...baseFilter }
          ];
        }
      } else {
        // Query all documents
        const baseFilter = { limit: 20 };
        if (pageParam) {
          filters = [
            { kinds: [30023], ...baseFilter, until: pageParam },
            { kinds: [30024], ...baseFilter, until: pageParam }
          ];
        } else {
          filters = [
            { kinds: [30023], ...baseFilter },
            { kinds: [30024], ...baseFilter }
          ];
        }
      }
      
      const events = await nostr.query(filters, { signal: abortSignal });
      const sortedEvents = events.sort((a, b) => b.created_at - a.created_at) as DocumentEvent[];
      
      return {
        documents: sortedEvents,
        nextCursor: sortedEvents.length >= 20 ? sortedEvents[sortedEvents.length - 1].created_at : undefined,
      };
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      // Only return nextCursor if we got a full page (20 items), indicating there might be more
      return lastPage.documents.length >= 20 ? lastPage.nextCursor : undefined;
    },
  });
}

export function useDocument(identifier: string, pubkey?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['document', identifier, pubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      const filter: {
        kinds: number[];
        '#d': string[];
        limit: number;
        authors?: string[];
      } = {
        kinds: [30023, 30024],
        '#d': [identifier],
        limit: 1,
      };
      
      if (pubkey) {
        filter.authors = [pubkey];
      }
      
      const events = await nostr.query([filter], { signal });
      return events[0] as DocumentEvent | undefined;
    },
    enabled: !!identifier,
  });
}

export function useUserDocuments(pubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['user-documents', pubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([
        { kinds: [30023, 30024], authors: [pubkey], limit: 50 }
      ], { signal });
      
      return events.sort((a, b) => b.created_at - a.created_at) as DocumentEvent[];
    },
    enabled: !!pubkey,
  });
}

export function useContacts(pubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['contacts', pubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([
        { kinds: [3], authors: [pubkey], limit: 1 }
      ], { signal });
      
      const contactsEvent = events[0];
      if (!contactsEvent) return [];
      
      // Extract pubkeys from p tags
      return contactsEvent.tags
        .filter(tag => tag[0] === 'p' && tag[1])
        .map(tag => tag[1]);
    },
    enabled: !!pubkey,
  });
}