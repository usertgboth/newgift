import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import CreateAd from "@/pages/CreateAd";
import MyAds from "@/pages/MyAds";
import Tasks from "@/pages/Tasks";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create-ad" component={CreateAd} />
      <Route path="/myads" component={MyAds} />
      <Route path="/tasks" component={Tasks} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
