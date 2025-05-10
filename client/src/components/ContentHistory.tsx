import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Content } from '@shared/schema';
import { getContentTypeName } from '@/lib/openai';
import { apiRequest } from '@/lib/queryClient';
import DeleteConfirmationModal from './DeleteConfirmationModal';

type ContentHistoryProps = {
  setScreen: (screen: string) => void;
  onViewContent: (content: Content) => void;
  onCopyContent: (content: Content) => void;
};

export default function ContentHistory({ setScreen, onViewContent, onCopyContent }: ContentHistoryProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch content history
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['/api/history', user?.id, selectedType],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const url = selectedType === 'all' 
        ? `/api/history?userId=${user.id}`
        : `/api/history?userId=${user.id}&type=${selectedType}`;
        
      const res = await fetch(url);
      if (!res.ok) return [];
      return res.json() as Promise<Content[]>;
    },
    enabled: !!user?.id,
  });
  
  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      if (!user?.id) return null;
      return apiRequest('DELETE', `/api/content/${contentId}?userId=${user.id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history', user?.id] });
      toast({
        title: "Conteúdo excluído",
        description: "O conteúdo foi removido do seu histórico",
      });
      setContentToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    }
  });
  
  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };
  
  const openDeleteModal = (content: Content) => {
    setContentToDelete(content);
  };
  
  const closeDeleteModal = () => {
    setContentToDelete(null);
  };
  
  const confirmDelete = () => {
    if (contentToDelete) {
      deleteContentMutation.mutate(contentToDelete.id);
    }
  };

  return (
    <div className="p-4 pb-20 sm:pb-4">
      <div className="mb-6">
        <button 
          className="flex items-center text-muted-foreground mb-4"
          onClick={() => setScreen('dashboard')}
        >
          <i className="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <h2 className="text-xl font-bold">Histórico de conteúdos</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={selectedType === 'all' ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => handleTypeFilter('all')}
          >
            Todos
          </Button>
          <Button
            size="sm"
            variant={selectedType === 'INSTAGRAM_POST' ? 'default' : 'outline'}
            className="rounded-full whitespace-nowrap"
            onClick={() => handleTypeFilter('INSTAGRAM_POST')}
          >
            Instagram
          </Button>
          <Button
            size="sm"
            variant={selectedType === 'BLOG_ARTICLE' ? 'default' : 'outline'}
            className="rounded-full whitespace-nowrap"
            onClick={() => handleTypeFilter('BLOG_ARTICLE')}
          >
            Blog
          </Button>
          <Button
            size="sm"
            variant={selectedType === 'FACEBOOK_AD' ? 'default' : 'outline'}
            className="rounded-full whitespace-nowrap"
            onClick={() => handleTypeFilter('FACEBOOK_AD')}
          >
            Facebook Ads
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
          <p className="text-muted-foreground">Carregando conteúdos...</p>
        </div>
      ) : contents.length > 0 ? (
        contents.map((content) => (
          <Card key={content.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {getContentTypeName(content.type)}
                  </span>
                  <h4 className="font-medium mt-2">{content.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </div>
                  <button 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => openDeleteModal(content)}
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {content.body.substring(0, 120)}...
              </p>
              <div className="flex space-x-2">
                <button 
                  className="text-xs px-3 py-1 border border-gray-200 rounded-lg flex items-center hover:bg-gray-50"
                  onClick={() => onViewContent(content)}
                >
                  <i className="fas fa-eye mr-1"></i> Ver
                </button>
                <button 
                  className="text-xs px-3 py-1 border border-gray-200 rounded-lg flex items-center hover:bg-gray-50"
                  onClick={() => onCopyContent(content)}
                >
                  <i className="fas fa-copy mr-1"></i> Copiar
                </button>
                <button 
                  className="text-xs px-3 py-1 border border-gray-200 text-red-500 rounded-lg flex items-center hover:bg-gray-50"
                  onClick={() => openDeleteModal(content)}
                >
                  <i className="fas fa-trash mr-1"></i> Excluir
                </button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Você ainda não gerou nenhum conteúdo</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => setScreen('generation')}
          >
            <i className="fas fa-plus mr-2"></i> Criar seu primeiro conteúdo
          </button>
        </div>
      )}
      
      <DeleteConfirmationModal 
        isOpen={!!contentToDelete}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={deleteContentMutation.isPending}
      />
    </div>
  );
}
