
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Home from "@/pages/Home";
import CreateAd from "@/pages/CreateAd";
import MyAds from "@/pages/MyAds";
import Tasks from "@/pages/Tasks";
import Profile from "@/pages/Profile";
import AdminPanel from "@/pages/AdminPanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create-ad" component={CreateAd} />
      <Route path="/myads" component={MyAds} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminPanel} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
