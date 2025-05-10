import { Button } from "@/components/ui/button";

type BottomNavigationProps = {
  activeScreen: string;
  setScreen: (screen: string) => void;
};

export default function BottomNavigation({ activeScreen, setScreen }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setScreen('dashboard')}
        className={`flex flex-col items-center justify-center rounded-lg ${
          activeScreen === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <i className="fas fa-home text-xl"></i>
        <span className="text-xs mt-1">Início</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setScreen('generation')}
        className={`flex flex-col items-center justify-center rounded-lg ${
          activeScreen === 'generation' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <i className="fas fa-plus-circle text-xl"></i>
        <span className="text-xs mt-1">Criar</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setScreen('history')}
        className={`flex flex-col items-center justify-center rounded-lg ${
          activeScreen === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <i className="fas fa-history text-xl"></i>
        <span className="text-xs mt-1">Histórico</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setScreen('metrics')}
        className={`flex flex-col items-center justify-center rounded-lg ${
          activeScreen === 'metrics' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <i className="fas fa-chart-pie text-xl"></i>
        <span className="text-xs mt-1">Métricas</span>
      </Button>
    </nav>
  );
}
