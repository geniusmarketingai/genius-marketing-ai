import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/hooks/useAuth";
import { Content, UserProfile } from '@shared/schema';
import { getContentTypeName } from '@/lib/openai';
import { apiRequest } from '@/lib/queryClient';

type DashboardProps = {
  setScreen: (screen: string) => void;
  onViewContent: (content: Content) => void;
  onCopyContent: (content: Content) => void;
};

export default function Dashboard({ setScreen, onViewContent, onCopyContent }: DashboardProps) {
  const { user } = useAuth();
  
  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['/api/profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/profile?userId=${user.id}`);
      if (!res.ok) return null;
      return res.json() as Promise<UserProfile>;
    },
    enabled: !!user?.id,
  });
  
  // Fetch user credits
  const { data: credits } = useQuery({
    queryKey: ['/api/credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return { amount: 0 };
      const res = await fetch(`/api/credits?userId=${user.id}`);
      if (!res.ok) return { amount: 0 };
      return res.json() as Promise<{ amount: number }>;
    },
    enabled: !!user?.id,
  });
  
  // Fetch content history
  const { data: contents } = useQuery({
    queryKey: ['/api/history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/history?userId=${user.id}`);
      if (!res.ok) return [];
      return res.json() as Promise<Content[]>;
    },
    enabled: !!user?.id,
  });
  
  // Fetch metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return { contentCount: 0, engagementRate: '0%' };
      const res = await fetch(`/api/metrics?userId=${user.id}`);
      if (!res.ok) return { contentCount: 0, engagementRate: '0%' };
      return res.json();
    },
    enabled: !!user?.id,
  });

  return (
    <div className="p-4 pb-20 sm:pb-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">
          👋 Olá, {profile?.name || user?.email?.split('@')[0] || 'amigo'}!
        </h2>
        <p className="text-muted-foreground">O que você quer criar hoje?</p>
      </div>
      
      {/* Credits Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Seus créditos</h3>
              <p className="text-2xl font-bold mt-1">{credits?.amount || 0}</p>
            </div>
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              <i className="fas fa-bolt text-xl"></i>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${Math.min(100, ((credits?.amount || 0) / 20) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {credits?.amount || 0} de 20 créditos disponíveis
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Conteúdos</h3>
            <p className="text-2xl font-bold mt-1">{metrics?.contentCount || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Engajamento</h3>
            <p className="text-2xl font-bold mt-1">72%</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Content */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Últimos conteúdos</h3>
          <button 
            className="text-sm text-primary"
            onClick={() => setScreen('history')}
          >
            Ver todos
          </button>
        </div>
        
        {contents && contents.length > 0 ? (
          contents.slice(0, 3).map((content) => (
            <Card key={content.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {getContentTypeName(content.type)}
                    </span>
                    <h4 className="font-medium mt-2">{content.title}</h4>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: '2-digit' 
                    })}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {content.body.substring(0, 100)}...
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
      </div>
    </div>
  );
}
