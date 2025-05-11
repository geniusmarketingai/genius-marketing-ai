import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/hooks/useAuth";
import { Content, UserProfile } from '@shared/schema';
import { getContentTypeName } from '@/lib/openai';
import { apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";

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

  const getEngagementBadgeClass = (engagementRate?: string): string => {
    if (!engagementRate) return 'bg-gray-100 text-gray-800';
    const rate = parseInt(engagementRate.replace('%', ''), 10);
    if (rate >= 70) return 'bg-green-100 text-green-800';
    if (rate >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const engagementValue = metrics?.engagementRate || '0%';

  return (
    <div className="p-4 pb-20 sm:pb-4 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          👋 Olá, {profile?.name || user?.email?.split('@')[0] || 'amigo'}!
        </h2>
        <p className="text-lg text-muted-foreground">Pronto para criar algo incrível hoje?</p>
      </div>
        
      {/* Métricas Principais */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">🚀 Seu progresso até agora:</h3>
          </div>
          <Card className="bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span>Créditos: <span className="font-semibold">{credits?.amount || 0} / 20</span></span>
                <Button variant="default" size="sm" onClick={() => console.log('Atualizar créditos clicado')}>
                  🔋 Atualizar créditos
                </Button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(100, ((credits?.amount || 0) / 20) * 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <CardContent className="p-4 flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Conteúdos Criados</h4>
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-3xl font-bold">{metrics?.contentCount || 0}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardContent className="p-4 flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Engajamento Médio</h4>
                <span 
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getEngagementBadgeClass(engagementValue)}`}
                >
                  {engagementValue}
                </span>
              </div>
              <p className="text-3xl font-bold">{engagementValue}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">🎯 O que você deseja criar?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <Button variant="outline" className="w-full justify-start py-6 text-left" onClick={() => setScreen('generation')}>
            <span className="text-2xl mr-3">📄</span>
            <div>
              <span className="font-semibold">Gerar post para Instagram</span>
              <p className="text-xs text-muted-foreground">Crie legendas e ideias para seu feed.</p>
            </div>
          </Button>
          <Button variant="outline" className="w-full justify-start py-6 text-left" onClick={() => setScreen('generation')}>
            <span className="text-2xl mr-3">✍️</span>
            <div>
              <span className="font-semibold">Criar blog SEO</span>
              <p className="text-xs text-muted-foreground">Artigos otimizados para buscadores.</p>
            </div>
          </Button>
          <Button variant="outline" className="w-full justify-start py-6 text-left" onClick={() => setScreen('generation')}>
            <span className="text-2xl mr-3">📢</span>
            <div>
              <span className="font-semibold">Criar anúncio</span>
              <p className="text-xs text-muted-foreground">Textos persuasivos para campanhas.</p>
            </div>
          </Button>
        </div>
        <Button variant="default" className="w-full" onClick={() => setScreen('generation')}>
          <i className="fas fa-plus mr-2"></i> Novo conteúdo personalizado
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Últimos conteúdos</h3>
          {contents && contents.length > 0 && (
            <button 
              className="text-sm text-primary hover:underline"
              onClick={() => setScreen('history')}
            >
              Ver todos
            </button>
          )}
        </div>
        
        {contents && contents.length > 0 ? (
          contents.slice(0, 3).map((content) => (
            <Card key={content.id} className="mb-4 transition-all hover:shadow-lg">
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
          <Card className="text-center py-10 px-6 bg-card shadow-lg">
            <CardContent>
              <span className="text-5xl mb-4 block">🎨</span>
              <h4 className="text-xl font-semibold mb-2">A criatividade está prestes a explodir!</h4>
              <p className="text-muted-foreground mb-6">
                Ainda não há conteúdos aqui. Clique abaixo para dar o primeiro passo e criar algo incrível.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                onClick={() => setScreen('generation')}
              >
                ✨ Criar meu primeiro conteúdo agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
