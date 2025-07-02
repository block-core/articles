import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface ActionBarProps {
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonText?: string;
  children?: ReactNode;
  className?: string;
}

export function ActionBar({ 
  showBackButton = false, 
  onBack, 
  backButtonText = "Back",
  children,
  className = ""
}: ActionBarProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backButtonText}
          </Button>
        )}
      </div>
      
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}