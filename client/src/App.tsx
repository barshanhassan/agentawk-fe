import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import TopNavbar from "@/components/TopNavbar";
import InsightsDashboard from "@/pages/InsightsDashboard";
import ConversationsInbox from "@/pages/ConversationsInbox";
import TemplateManager from "@/pages/TemplateManager";
import CampaignManager from "@/pages/CampaignManager";
import ContactsPage from "@/pages/ContactsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={InsightsDashboard} />
      <Route path="/conversations/inbox" component={ConversationsInbox} />
      <Route path="/templates" component={TemplateManager} />
      <Route path="/campaigns" component={CampaignManager} />
      <Route path="/contacts" component={ContactsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <AppSidebar collapsed={sidebarCollapsed} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
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
