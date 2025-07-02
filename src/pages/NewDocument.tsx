import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentEditor } from '@/components/DocumentEditor';
import { TemplateSelector } from '@/components/TemplateSelector';
import { Button } from '@/components/ui/button';
import { ActionBar } from '@/components/ActionBar';

import { LoginArea } from '@/components/auth/LoginArea';
import { Header } from '@/components/Header';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { type DocumentTemplate } from '@/lib/documentTemplates';
import { Save, FileText } from 'lucide-react';


export default function NewDocument() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleBack = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
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
            <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
            <p className="text-muted-foreground mb-6">
              You need to connect your Nostr account to create articles.
            </p>
            <LoginArea className="max-w-60 mx-auto mb-4" />
            <Button variant="outline" onClick={() => navigate('/')}>
              Browse Articles Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      <Header />
      
      {selectedTemplate ? (
        <DocumentEditor 
          templateContent={selectedTemplate.content} 
          renderActions={({ handleSaveDraft, handlePublish, isPublishing }) => (
            <div className="container mx-auto px-4 py-6 max-w-6xl">
              <ActionBar 
                showBackButton 
                onBack={handleBack} 
                backButtonText="Back to Templates"
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
                  Publish
                </Button>
              </ActionBar>
            </div>
          )}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <ActionBar 
            showBackButton 
            onBack={handleBack} 
            backButtonText="Back to Dashboard"
          />
          <TemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>
      )}
    </div>
  );
}