import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";  // Now our horizontal top bar
// Remove this line if you're deleting TopNavbar
// import TopNavbar from "@/components/TopNavbar";

import InsightsDashboard from "@/pages/InsightsDashboard";
import ConversationsInbox from "@/pages/ConversationsInbox";
import BotConversations from "@/pages/BotConversations";
import ConversationsLogs from "@/pages/ConversationsLogs";
import TemplateManager from "@/pages/TemplateManager";
import CampaignManager from "@/pages/CampaignManager";
import UserManagementPage from "@/pages/UserManagementPage";
import ContactsPage from "@/pages/ContactsPage";
import BillingPage from "@/pages/BillingPage";
import WhatsAppManagerPage from "@/pages/WhatsAppManagerPage";
import SettingsPage from "@/pages/SettingsPage";
import TeamManagementSection from "@/components/sections/TeamManagementSection";
import WorkspaceManagementPage from "@/pages/WorkspaceManagementPage";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      
      <Route path="/insights">
        <ProtectedRoute><InsightsDashboard /></ProtectedRoute>
      </Route>
      <Route path="/conversations/inbox">
        <ProtectedRoute><ConversationsInbox /></ProtectedRoute>
      </Route>
      <Route path="/conversations/bot">
        <ProtectedRoute><BotConversations /></ProtectedRoute>
      </Route>
      <Route path="/conversations/logs">
        <ProtectedRoute><ConversationsLogs /></ProtectedRoute>
      </Route>
      <Route path="/templates">
        <ProtectedRoute><TemplateManager /></ProtectedRoute>
      </Route>
      <Route path="/campaigns">
        <ProtectedRoute><CampaignManager /></ProtectedRoute>
      </Route>
      <Route path="/contacts">
        <ProtectedRoute><ContactsPage /></ProtectedRoute>
      </Route>
      <Route path="/users">
        <ProtectedRoute><UserManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/teams">
        <ProtectedRoute>
          <div className="p-6"><TeamManagementSection /></div>
        </ProtectedRoute>
      </Route>
      <Route path="/workspaces">
        <ProtectedRoute><WorkspaceManagementPage /></ProtectedRoute>
      </Route>
      <Route path="/billing">
        <ProtectedRoute><BillingPage /></ProtectedRoute>
      </Route>
      <Route path="/whatsapp-manager">
        <ProtectedRoute><WhatsAppManagerPage /></ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      </Route>
      
      <Route path="/">
        <ProtectedRoute><InsightsDashboard /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    setIsLoggedIn(checkAuthStatus());
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          {/* New: Horizontal Top Bar (only shown when logged in) */}
          {isLoggedIn && <AppSidebar />}

          {/* Main content area - now full width, with top padding */}
          <main className="flex-1 overflow-auto bg-accent/30 pt-16">
            <Router />
          </main>

          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;