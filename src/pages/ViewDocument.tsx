import { useParams, useNavigate } from 'react-router-dom';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionBar } from '@/components/ActionBar';

import { Header } from '@/components/Header';
import { useDocument } from '@/hooks/useDocuments';
import { nip19 } from 'nostr-tools';
import { AlertCircle, Share2 } from 'lucide-react';

export default function ViewDocument() {
  const { nip19: nip19Param } = useParams<{ nip19: string }>();
  const navigate = useNavigate();

  // Parse the NIP-19 identifier or regular identifier
  let identifier = '';
  let pubkey = '';
  
  if (nip19Param) {
    // Check if it's a NIP-19 identifier
    if (nip19Param.startsWith('naddr1') || nip19Param.startsWith('nevent1') || nip19Param.startsWith('note1')) {
      try {
        const decoded = nip19.decode(nip19Param);
        if (decoded.type === 'naddr') {
          const naddr = decoded.data;
          identifier = naddr.identifier;
          pubkey = naddr.pubkey;
        } else if (decoded.type === 'nevent') {
          const nevent = decoded.data;
          identifier = nevent.id;
          if (nevent.author) {
            pubkey = nevent.author;
          }
        } else if (decoded.type === 'note') {
          identifier = decoded.data;
        }
      } catch (error) {
        console.error('Failed to decode NIP-19 identifier:', error);
        identifier = nip19Param;
      }
    } else {
      // Treat as regular identifier
      identifier = nip19Param;
    }
  }

  const { data: document, isLoading, error } = useDocument(identifier, pubkey);

  const handleBack = () => {
    navigate('/');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document?.tags.find(tag => tag[0] === 'title')?.[1] || 'Article',
          text: document?.tags.find(tag => tag[0] === 'summary')?.[1] || '',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You might want to show a toast here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <ActionBar 
            showBackButton 
            onBack={handleBack} 
            backButtonText="Back to Dashboard"
          />
          
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
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
            backButtonText="Back to Dashboard"
          />
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Article Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The article you're looking for could not be found. It may have been deleted or the link is incorrect.
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ActionBar 
          showBackButton 
          onBack={handleBack} 
          backButtonText="Back to Dashboard"
        >
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </ActionBar>
      </div>
      
      <DocumentViewer document={document} />
    </div>
  );
}