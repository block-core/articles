import { useParams, useNavigate } from 'react-router-dom';
import { DocumentEditor } from '@/components/DocumentEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginArea } from '@/components/auth/LoginArea';
import { ActionBar } from '@/components/ActionBar';
import { Header } from '@/components/Header';
import { useDocument } from '@/hooks/useDocuments';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { AlertCircle, Save, FileText } from 'lucide-react';

export default function EditDocument() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  
  const { data: document, isLoading, error } = useDocument(identifier || '', user?.pubkey);

  const handleBack = () => {
    if (document) {
      navigate(`/document/${identifier}`);
    } else {
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Edit Document</h1>
            <p className="text-muted-foreground mb-6">
              You need to connect your Nostr account to edit documents.
            </p>
            <LoginArea className="max-w-60 mx-auto mb-4" />
            <Button variant="outline" onClick={() => navigate('/')}>
              Browse Documents Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <ActionBar 
            showBackButton 
            onBack={handleBack} 
            backButtonText="Back"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <ActionBar 
            showBackButton 
            onBack={handleBack} 
            backButtonText="Back"
          />
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Document Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The document you're trying to edit could not be found or you don't have permission to edit it.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if user owns the document
  if (document.pubkey !== user.pubkey) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <ActionBar 
            showBackButton 
            onBack={handleBack} 
            backButtonText="Back"
          />
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have permission to edit this document. Only the author can edit their documents.
              </p>
              <Button onClick={() => navigate(`/document/${identifier}`)} className="w-full">
                View Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      <Header />
      
      <DocumentEditor 
        document={document} 
        renderActions={({ handleSaveDraft, handlePublish, isPublishing, document }) => (
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <ActionBar 
              showBackButton 
              onBack={handleBack} 
              backButtonText="Back to Document"
            >
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
            </ActionBar>
          </div>
        )}
      />
    </div>
  );
}