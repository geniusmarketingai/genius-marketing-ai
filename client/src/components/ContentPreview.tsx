import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getContentTypeName } from "@/lib/openai";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ContentPreviewProps = {
  content: any;
  setScreen: (screen: string) => void;
  onRegenerateContent: () => void;
};

export default function ContentPreview({ content, setScreen, onRegenerateContent }: ContentPreviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const copyContent = () => {
    navigator.clipboard.writeText(content.generatedContent);
    
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência",
    });
  };
  
  const saveContentMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !content?.content?.id) return null;
      return apiRequest('POST', '/api/content/save', { contentId: content.content.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history', user?.id] });
      toast({
        title: "Conteúdo salvo!",
        description: "O conteúdo foi adicionado ao seu histórico",
      });
      setScreen('dashboard');
    },
    onError: (error) => {
      console.error("Error saving content:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    }
  });
  
  const handleRegenerateContent = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateContent();
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast({
        title: "Erro ao regenerar",
        description: "Não foi possível criar uma nova versão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };
  
  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      await saveContentMutation.mutateAsync();
    } finally {
      setIsSaving(false);
    }
  };

  const contentTypeLabel = getContentTypeName(content?.content?.type || 'INSTAGRAM_POST');

  return (
    <div className="p-4 pb-20 sm:pb-4">
      <div className="mb-6">
        <button 
          className="flex items-center text-muted-foreground mb-4"
          onClick={() => setScreen('generation')}
        >
          <i className="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Conteúdo gerado</h2>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {contentTypeLabel}
          </span>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-5">
          <h3 className="font-medium text-lg mb-3">{content?.content?.title}</h3>
          
          <div className="prose max-w-none text-gray-700 mb-4">
            {content?.generatedContent?.split('\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <Button 
          className="w-full bg-accent hover:bg-accent/90"
          onClick={copyContent}
        >
          <i className="fas fa-copy mr-2"></i> Copiar Conteúdo
        </Button>
        
        <Button 
          className="w-full"
          onClick={handleSaveContent}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i> Salvando...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i> Salvar no Histórico
            </>
          )}
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={handleRegenerateContent}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i> Gerando...
            </>
          ) : (
            <>
              <i className="fas fa-redo mr-2"></i> Gerar Nova Versão
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
