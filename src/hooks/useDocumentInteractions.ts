import { useInView } from 'react-intersection-observer';
import { useReactions } from './useReactions';
import { useComments } from './useComments';
import { useZaps } from './useZaps';
import type { DocumentEvent } from './useDocuments';

export function useDocumentInteractions(document: DocumentEvent) {
  // Set up intersection observer
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
    triggerOnce: true, // Only trigger once when first coming into view
    rootMargin: '100px', // Start loading 100px before the element comes into view
  });

  // Only fetch data when the element is in view
  const { data: reactions } = useReactions(document.id, document.pubkey, {
    enabled: inView,
  });
  
  const { data: comments = [] } = useComments(document, {
    enabled: inView,
  });
  
  const { data: zaps } = useZaps(document.id, {
    enabled: inView,
  });

  const likeCount = reactions?.likeCount || 0;
  const commentCount = comments.length;
  const zapCount = zaps?.zapCount || 0;

  // Only show loading if we're in view and still fetching data
  const isLoading = inView && (!reactions || !comments || !zaps);
  
  // Don't show loading indicators if all counts are 0 and we've loaded
  const hasInteractions = likeCount > 0 || commentCount > 0 || zapCount > 0;
  const shouldShowLoading = isLoading && !hasInteractions;

  return {
    ref,
    inView,
    likeCount,
    commentCount,
    zapCount,
    isLoading: shouldShowLoading,
    hasInteractions,
  };
}