import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import TopNavbar from "@/components/TopNavbar";
import InsightsDashboard from "@/pages/InsightsDashboard";
import ConversationsInbox from "@/pages/ConversationsInbox";
import BotConversations from "@/pages/BotConversations";
import ConversationsLogs from "@/pages/ConversationsLogs";
import TemplateManager from "@/pages/TemplateManager";
import CampaignManager from "@/pages/CampaignManager";
import UserManagementPage from "@/pages/UserManagementPage";
import ContactsPage from "@/pages/ContactsPage";
import TeamManagementSection from "@/components/sections/TeamManagementSection";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      
      {/* Protected Routes - Order from most specific to least specific */}
      <Route path="/insights">
        <ProtectedRoute>
          <InsightsDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/conversations/inbox">
        <ProtectedRoute>
          <ConversationsInbox />
        </ProtectedRoute>
      </Route>
      <Route path="/conversations/bot">
        <ProtectedRoute>
          <BotConversations />
        </ProtectedRoute>
      </Route>
      <Route path="/conversations/logs">
        <ProtectedRoute>
          <ConversationsLogs />
        </ProtectedRoute>
      </Route>
      <Route path="/templates">
        <ProtectedRoute>
          <TemplateManager />
        </ProtectedRoute>
      </Route>
      <Route path="/campaigns">
        <ProtectedRoute>
          <CampaignManager />
        </ProtectedRoute>
      </Route>
      <Route path="/contacts">
        <ProtectedRoute>
          <ContactsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/users">
        <ProtectedRoute>
          <UserManagementPage />
        </ProtectedRoute>
      </Route>
      <Route path="/teams">
        <ProtectedRoute>
          <div className="p-6">
            <TeamManagementSection />
          </div>
        </ProtectedRoute>
      </Route>
      
      {/* Root route - should be last among protected routes */}
      <Route path="/">
        <ProtectedRoute>
          <InsightsDashboard />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation(); // Get current location from wouter
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check authentication status
  const checkAuthStatus = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith('demoLogin=true')) {
        return true;
      }
    }
    return false;
  };

  // Update isLoggedIn state whenever the location changes
  useEffect(() => {
    setIsLoggedIn(checkAuthStatus());
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          {isLoggedIn && <AppSidebar collapsed={sidebarCollapsed} />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {isLoggedIn && <TopNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />}
            <main className="flex-1 overflow-auto bg-accent/30">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
