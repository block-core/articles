import { LoginArea } from '@/components/auth/LoginArea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ 
  title,
  className = ""
}: HeaderProps) {
  return (
    <div className={`border-b bg-white dark:bg-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Nostr Article</h1>
              <p className="text-sm text-muted-foreground">Your decentralized article publishing platform</p>
            </div>
            {title && (
              <div className="border-l pl-4 ml-2">
                <h2 className="text-lg font-medium">{title}</h2>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LoginArea className="max-w-60" />
          </div>
        </div>
      </div>
    </div>
  );
}