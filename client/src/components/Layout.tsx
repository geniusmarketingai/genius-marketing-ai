import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import Auth from "./Auth";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import ContentGeneration from "./ContentGeneration";
import ContentPreview from "./ContentPreview";
import ContentHistory from "./ContentHistory";
import MetricsDashboard from "./MetricsDashboard";
import ProfileModal from "./ProfileModal";
import BottomNavigation from "./BottomNavigation";
import { Content } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Layout() {
  const [screen, setScreen] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { user, isLoading, hasProfile } = useAuth();
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Auth />;
  }
  
  if (!hasProfile) {
    return <Onboarding onComplete={() => setScreen('dashboard')} />;
  }
  
  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
  };
  
  const handleRegenerateContent = async () => {
    // In a real app, would call the generate content again with same params
    // For now, just returning to generation page
    setScreen('generation');
  };
  
  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setGeneratedContent({
      content,
      generatedContent: content.body
    });
    setScreen('preview');
  };
  
  const handleCopyContent = (content: Content) => {
    navigator.clipboard.writeText(content.body);
    
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência",
    });
  };
  
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col relative pb-16 sm:pb-0 sm:max-w-none">
      {/* Header */}
      {screen !== 'auth' && screen !== 'onboarding' && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-primary">Genius Marketing AI</h1>
            
            <div className="flex items-center">
              <button 
                className="rounded-full overflow-hidden w-8 h-8 bg-gray-200 flex items-center justify-center text-gray-800"
                aria-label="Menu de perfil"
                onClick={() => setShowProfileModal(true)}
              >
                <i className="fas fa-user"></i>
              </button>
            </div>
          </div>
        </header>
      )}
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {screen === 'dashboard' && (
          <Dashboard 
            setScreen={setScreen} 
            onViewContent={handleViewContent} 
            onCopyContent={handleCopyContent}
          />
        )}
        
        {screen === 'generation' && (
          <ContentGeneration 
            setScreen={setScreen} 
            onContentGenerated={handleContentGenerated} 
          />
        )}
        
        {screen === 'preview' && generatedContent && (
          <ContentPreview 
            content={generatedContent} 
            setScreen={setScreen} 
            onRegenerateContent={handleRegenerateContent} 
          />
        )}
        
        {screen === 'history' && (
          <ContentHistory 
            setScreen={setScreen} 
            onViewContent={handleViewContent} 
            onCopyContent={handleCopyContent}
          />
        )}
        
        {screen === 'metrics' && (
          <MetricsDashboard setScreen={setScreen} />
        )}
      </main>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen={screen} 
        setScreen={setScreen} 
      />
    </div>
  );
}
