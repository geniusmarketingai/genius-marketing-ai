import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

type MetricsDashboardProps = {
  setScreen: (screen: string) => void;
};

export default function MetricsDashboard({ setScreen }: MetricsDashboardProps) {
  const { user } = useAuth();
  
  // Fetch metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return { 
        contentCount: 0, 
        typeDistribution: [],
        credits: 0,
      };
      
      const res = await fetch(`/api/metrics?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
    enabled: !!user?.id,
  });
  
  const getChartHeight = (count: number, maxCount: number) => {
    if (maxCount === 0) return '10%';
    return `${Math.max(10, Math.round((count / maxCount) * 100))}%`;
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
        <h2 className="text-xl font-bold">Métricas</h2>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Conteúdos Criados</h3>
                <p className="text-2xl font-bold mt-1">{metrics?.contentCount || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Taxa de Aproveitamento</h3>
                <p className="text-2xl font-bold mt-1">85%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Engajamento Médio</h3>
                <p className="text-2xl font-bold mt-1">72%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Créditos Consumidos</h3>
                <p className="text-2xl font-bold mt-1">{metrics?.contentCount || 0}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">Conteúdos por tipo</h3>
              <div className="h-52 relative">
                {metrics?.typeDistribution && metrics.typeDistribution.length > 0 ? (
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-around">
                    {metrics.typeDistribution.map((item: any, index: number) => {
                      const maxCount = Math.max(...metrics.typeDistribution.map((d: any) => d.count));
                      const colors = ['blue-500', 'green-500', 'orange-500'];
                      
                      return (
                        <div key={item.type} className="w-1/3 px-2">
                          <div 
                            className={`bg-${colors[index % colors.length]} w-full rounded-t-md`} 
                            style={{ height: getChartHeight(item.count, maxCount) }}
                          ></div>
                          <p className="text-xs text-center mt-2">
                            {item.type === 'INSTAGRAM_POST' ? 'Instagram' : 
                             item.type === 'BLOG_ARTICLE' ? 'Blog' : 'Facebook Ads'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">
                      Sem dados suficientes para mostrar o gráfico
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">Uso de créditos (últimos 30 dias)</h3>
              <div className="h-52 relative">
                {/* Simple line chart using SVG */}
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    points="
                      0,50
                      5,45
                      10,48
                      15,40
                      20,42
                      25,38
                      30,35
                      35,30
                      40,32
                      45,25
                      50,28
                      55,22
                      60,20
                      65,18
                      70,15
                      75,10
                      80,12
                      85,8
                      90,5
                      95,2
                      100,0
                    "
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
