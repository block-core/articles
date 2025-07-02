import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { DocumentInteractions } from '@/components/DocumentInteractions';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { 
  getDocumentTitle, 
  getDocumentSummary, 
  getDocumentImage, 
  getDocumentTags, 
  getDocumentIdentifier,
  getPublishedAt,
  isDraft 
} from '@/lib/documentUtils';
import { genUserName } from '@/lib/genUserName';
import { formatRelativeTime } from '@/lib/formatTime';
import type { DocumentEvent } from '@/hooks/useDocuments';
import { 
  Edit3, 
  Calendar, 
  User, 
  Tag,
  FileText
} from 'lucide-react';

interface DocumentViewerProps {
  document: DocumentEvent;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const { user } = useCurrentUser();
  const author = useAuthor(document.pubkey);
  
  const title = getDocumentTitle(document);
  const summary = getDocumentSummary(document);
  const image = getDocumentImage(document);
  const tags = getDocumentTags(document);
  const identifier = getDocumentIdentifier(document);
  const publishedAt = getPublishedAt(document);
  const isDocumentDraft = isDraft(document);
  
  const authorMetadata = author.data?.metadata;
  const authorName = authorMetadata?.display_name || authorMetadata?.name || genUserName(document.pubkey);
  const authorAvatar = authorMetadata?.picture;
  
  const isOwner = user?.pubkey === document.pubkey;
  const createdDate = new Date(document.created_at * 1000);
  const publishedDate = publishedAt ? new Date(publishedAt * 1000) : null;



  return (
    <div className="container mx-auto px-4 max-w-4xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isDocumentDraft && (
              <Badge variant="secondary">
                <FileText className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            )}
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button size="sm" asChild>
                <Link to={`/edit/${identifier}`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {image && (
          <div className="mb-6">
            <img
              src={image}
              alt={title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h1>

        {/* Summary */}
        {summary && (
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {summary}
          </p>
        )}

        {/* Author and Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{authorName}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {publishedDate ? (
                    <span>Published {formatRelativeTime(publishedAt!)}</span>
                  ) : (
                    <span>Created {formatRelativeTime(document.created_at)}</span>
                  )}
                </div>
                {publishedDate && publishedDate.getTime() !== createdDate.getTime() && (
                  <div className="flex items-center gap-1">
                    <Edit3 className="h-3 w-3" />
                    <span>Updated {formatRelativeTime(document.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator />
      </div>

      {/* Content */}
      <article className="mb-8">
        {document.content ? (
          <MarkdownRenderer content={document.content} />
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">This document has no content.</p>
          </div>
        )}
      </article>

      {/* Interactions */}
      <DocumentInteractions document={document} />

      {/* Footer */}
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{authorName}</p>
              <p className="text-sm text-muted-foreground">
                {authorMetadata?.about || 'Nostr user'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}