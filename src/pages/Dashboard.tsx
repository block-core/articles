import { DocumentList } from '@/components/DocumentList';
import { LoginArea } from '@/components/auth/LoginArea';
import { Header } from '@/components/Header';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Dashboard() {
  const { user } = useCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!user && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Nostr Article</h2>
              <p className="text-muted-foreground mb-4">
                Browse and discover long-form articles on the Nostr network. 
                Connect your Nostr account to create and publish your own articles.
              </p>
              <LoginArea className="max-w-60 mx-auto" />
            </div>
          </div>
        )}
        <DocumentList showCreateButton={!!user} />
      </div>
    </div>
  );
}