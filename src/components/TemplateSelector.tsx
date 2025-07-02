import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { documentTemplates, type DocumentTemplate } from '@/lib/documentTemplates';
import { Search, FileText } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = documentTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Start with a template or create a blank article
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => onSelectTemplate(template)}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No templates found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, onSelect }: { 
  template: DocumentTemplate; 
  onSelect: () => void; 
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{template.icon}</div>
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {template.name}
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {template.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Content Preview */}
        {template.content && (
          <div className="text-xs text-muted-foreground mb-4">
            <p className="line-clamp-3">
              {template.content.substring(0, 120)}...
            </p>
          </div>
        )}
        
        <Button className="w-full" variant="outline">
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
}