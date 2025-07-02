
import { nip19 } from 'nostr-tools';
import type { DocumentEvent } from '@/hooks/useDocuments';

export function getDocumentTitle(event: DocumentEvent): string {
  const titleTag = event.tags.find(tag => tag[0] === 'title');
  return titleTag?.[1] || 'Untitled Document';
}

export function getDocumentSummary(event: DocumentEvent): string {
  const summaryTag = event.tags.find(tag => tag[0] === 'summary');
  return summaryTag?.[1] || '';
}

export function getDocumentImage(event: DocumentEvent): string {
  const imageTag = event.tags.find(tag => tag[0] === 'image');
  return imageTag?.[1] || '';
}

export function getDocumentIdentifier(event: DocumentEvent): string {
  const dTag = event.tags.find(tag => tag[0] === 'd');
  return dTag?.[1] || '';
}

export function getDocumentTags(event: DocumentEvent): string[] {
  return event.tags.filter(tag => tag[0] === 't').map(tag => tag[1]);
}

export function getPublishedAt(event: DocumentEvent): number | null {
  const publishedTag = event.tags.find(tag => tag[0] === 'published_at');
  return publishedTag?.[1] ? parseInt(publishedTag[1]) : null;
}

export function isDraft(event: DocumentEvent): boolean {
  return event.kind === 30024;
}

export function generateDocumentId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function createDocumentTags(
  identifier: string,
  title: string,
  summary?: string,
  image?: string,
  tags?: string[],
  publishedAt?: number
): string[][] {
  const eventTags: string[][] = [
    ['d', identifier],
    ['title', title],
  ];

  if (summary) {
    eventTags.push(['summary', summary]);
  }

  if (image) {
    eventTags.push(['image', image]);
  }

  if (publishedAt) {
    eventTags.push(['published_at', publishedAt.toString()]);
  }

  if (tags && tags.length > 0) {
    tags.forEach(tag => {
      eventTags.push(['t', tag.toLowerCase()]);
    });
  }

  return eventTags;
}

export function createDocumentNaddr(event: DocumentEvent): string {
  const identifier = getDocumentIdentifier(event);
  
  return nip19.naddrEncode({
    identifier,
    pubkey: event.pubkey,
    kind: event.kind,
  });
}