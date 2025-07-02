import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useReactions, useUserReaction, useLikeDocument } from '@/hooks/useReactions';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useZaps, useZapDocument } from '@/hooks/useZaps';
import { useToast } from '@/hooks/useToast';
import { genUserName } from '@/lib/genUserName';
import { formatRelativeTime } from '@/lib/formatTime';
import type { DocumentEvent } from '@/hooks/useDocuments';
import type { CommentEvent } from '@/hooks/useComments';
import { 
  Heart, 
  MessageCircle, 
  Zap, 
  Send, 
  User,
  Loader2
} from 'lucide-react';

interface DocumentInteractionsProps {
  document: DocumentEvent;
}

export function DocumentInteractions({ document }: DocumentInteractionsProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  
  // Reactions
  const { data: reactions } = useReactions(document.id, document.pubkey);
  const { data: userReaction } = useUserReaction(document.id);
  const { mutate: likeDocument, isPending: isLiking } = useLikeDocument();
  
  // Comments
  const { data: comments = [] } = useComments(document);
  const { mutate: createComment, isPending: isCommenting } = useCreateComment();
  
  // Zaps
  const { data: zaps } = useZaps(document.id);
  const { mutate: zapDocument, isPending: isZapping } = useZapDocument();
  
  // UI state
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [zapAmount, setZapAmount] = useState(21);
  const [zapComment, setZapComment] = useState('');
  
  const isLiked = userReaction?.content === '+';
  const likeCount = reactions?.likeCount || 0;
  const commentCount = comments.length;
  const zapCount = zaps?.zapCount || 0;
  const totalZapAmount = zaps?.totalAmount || 0;

  const handleLike = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You need to be logged in to like documents.',
        variant: 'destructive',
      });
      return;
    }

    likeDocument({ document, isLiked });
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You need to be logged in to comment.',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    createComment(
      { document, content: newComment },
      {
        onSuccess: () => {
          setNewComment('');
          toast({
            title: 'Success',
            description: 'Comment posted successfully!',
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to post comment.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleZap = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You need to be logged in to zap documents.',
        variant: 'destructive',
      });
      return;
    }

    zapDocument(
      { document, amount: zapAmount, comment: zapComment },
      {
        onSuccess: () => {
          setZapComment('');
          toast({
            title: 'Success',
            description: `Zapped ${zapAmount} sats!`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to send zap.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 py-4 border-t border-b">
        {/* Like Button */}
        <Button
          variant={isLiked ? 'default' : 'outline'}
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-2"
        >
          {isLiking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          )}
          {likeCount > 0 && <span>{likeCount}</span>}
        </Button>

        {/* Comment Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </Button>

        {/* Zap Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {zapCount > 0 && <span>{zapCount}</span>}
              {totalZapAmount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {totalZapAmount} sats
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Lightning Zap</DialogTitle>
              <DialogDescription>
                Send sats to support this document via Lightning Network.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zap-amount">Amount (sats)</Label>
                <Input
                  id="zap-amount"
                  type="number"
                  value={zapAmount}
                  onChange={(e) => setZapAmount(parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="21"
                />
              </div>
              <div>
                <Label htmlFor="zap-comment">Comment (optional)</Label>
                <Textarea
                  id="zap-comment"
                  value={zapComment}
                  onChange={(e) => setZapComment(e.target.value)}
                  placeholder="Great article!"
                  rows={2}
                />
              </div>
              <Button 
                onClick={handleZap} 
                disabled={isZapping || zapAmount <= 0}
                className="w-full"
              >
                {isZapping ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Zap...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Zap {zapAmount} sats
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Comments Section */}
      {showComments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({commentCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* New Comment Form */}
            {user ? (
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleComment}
                    disabled={isCommenting || !newComment.trim()}
                    size="sm"
                  >
                    {isCommenting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
                <Separator />
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>You need to be logged in to comment.</p>
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentEvent }) {
  const author = useAuthor(comment.pubkey);
  const authorMetadata = author.data?.metadata;
  const authorName = authorMetadata?.display_name || authorMetadata?.name || genUserName(comment.pubkey);
  const authorAvatar = authorMetadata?.picture;

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={authorAvatar} alt={authorName} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}