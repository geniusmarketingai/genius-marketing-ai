import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/components/Auth";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { AuthProvider } from "@/hooks/useAuth";
import { supabase } from "./lib/supabaseClient";

function Router() {
  const [location] = useLocation();

  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/login" component={Auth} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Handle URL hash for Supabase auth callbacks
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#access_token=')) {
        try {
          console.log("Auth callback detected in URL hash");
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Error handling auth callback:", error);
          } else if (data?.session) {
            console.log("Successfully set auth session from URL hash");
            // Remove the hash
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (e) {
          console.error("Error processing auth callback:", e);
        }
      } else if (hash && hash.startsWith('#error=')) {
        console.error("Auth error in callback:", hash);
        // Remove the error hash
        window.history.replaceState(null, '', window.location.pathname);
        // You could also show an error toast here
      }
    };

    // Handle the hash when component mounts
    handleHashChange();

    // Also listen for hash changes in case user uses browser back button
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
