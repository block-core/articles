import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';
import { createDocumentTags, generateDocumentId } from '@/lib/documentUtils';
import { formatRelativeTime } from '@/lib/formatTime';
import type { DocumentEvent } from '@/hooks/useDocuments';
import { 
  Save, 
  Eye, 
  Edit3, 
  FileText, 
  Tag, 
  Calendar,
  X,
  Plus,
  Type,
  Code
} from 'lucide-react';

interface DocumentEditorProps {
  document?: DocumentEvent;
  templateContent?: string;
  onSave?: (document: DocumentEvent) => void;
  renderActions?: (props: { 
    handleSaveDraft: () => void; 
    handlePublish: () => void; 
    isPublishing: boolean;
    document?: DocumentEvent;
  }) => React.ReactNode;
}

export function DocumentEditor({ document, templateContent, onSave, renderActions }: DocumentEditorProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { mutate: publishEvent, isPending: isPublishing } = useNostrPublish();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [identifier, setIdentifier] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  // Initialize form with document or template data
  useEffect(() => {
    if (document) {
      const titleTag = document.tags.find(tag => tag[0] === 'title');
      const summaryTag = document.tags.find(tag => tag[0] === 'summary');
      const imageTag = document.tags.find(tag => tag[0] === 'image');
      const dTag = document.tags.find(tag => tag[0] === 'd');
      const tTags = document.tags.filter(tag => tag[0] === 't').map(tag => tag[1]);

      setTitle(titleTag?.[1] || '');
      setContent(document.content);
      setSummary(summaryTag?.[1] || '');
      setImage(imageTag?.[1] || '');
      setTags(tTags);
      setIsDraft(document.kind === 30024);
      setIdentifier(dTag?.[1] || '');
    } else if (templateContent) {
      setContent(templateContent);
      setIdentifier(generateDocumentId());
    } else {
      setIdentifier(generateDocumentId());
    }
  }, [document, templateContent]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveDraft = () => handleSave(false);
  const handlePublish = () => handleSave(true);

  const handleSave = (publish = false) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save documents.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your document.',
        variant: 'destructive',
      });
      return;
    }

    const kind = publish ? 30023 : 30024;
    const publishedAt = publish && !document ? Math.floor(Date.now() / 1000) : undefined;
    
    const eventTags = createDocumentTags(
      identifier,
      title.trim(),
      summary.trim() || undefined,
      image.trim() || undefined,
      tags.length > 0 ? tags : undefined,
      publishedAt
    );

    publishEvent({
      kind,
      content: content.trim(),
      tags: eventTags,
    }, {
      onSuccess: (event) => {
        toast({
          title: 'Success',
          description: publish ? 'Document published successfully!' : 'Draft saved successfully!',
        });
        
        if (onSave) {
          onSave(event as DocumentEvent);
        }
        
        // Navigate to the document view
        navigate(`/document/${identifier}`);
      },
      onError: (error) => {
        console.error('Failed to save document:', error);
        toast({
          title: 'Error',
          description: 'Failed to save document. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create or edit documents.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const defaultActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={handleSaveDraft}
        disabled={isPublishing}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Draft
      </Button>
      <Button
        onClick={handlePublish}
        disabled={isPublishing}
      >
        <FileText className="h-4 w-4 mr-2" />
        {document?.kind === 30023 ? 'Update' : 'Publish'}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Action Bar */}
      {renderActions ? (
        renderActions({ handleSaveDraft, handlePublish, isPublishing, document })
      ) : (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">
              {document ? 'Edit Document' : 'New Document'}
            </h1>
          </div>
          {defaultActions}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'edit' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={editorMode === 'rich' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditorMode('rich')}
                  >
                    <Type className="h-4 w-4 mr-1" />
                    Rich Text
                  </Button>
                  <Button
                    variant={editorMode === 'markdown' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditorMode('markdown')}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    Markdown
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title..."
                    className="text-lg font-semibold"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  {editorMode === 'rich' ? (
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Write your document content..."
                      className="min-h-[500px]"
                    />
                  ) : (
                    <>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your document content in Markdown..."
                        className="min-h-[500px] font-mono"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports Markdown formatting. Use **bold**, *italic*, `code`, and more.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">{title || 'Untitled Document'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content to preview. Switch to Edit tab to add content.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="draft-toggle">Draft Mode</Label>
                <Switch
                  id="draft-toggle"
                  checked={isDraft}
                  onCheckedChange={setIsDraft}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {isDraft ? 'Document is saved as draft' : 'Document will be published'}
              </p>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of your document..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button size="sm" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Info */}
          {document && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Document Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {formatRelativeTime(document.created_at)}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{' '}
                  {document.kind === 30023 ? 'Published' : 'Draft'}
                </div>
                <div>
                  <span className="font-medium">ID:</span>{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {identifier}
                  </code>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}