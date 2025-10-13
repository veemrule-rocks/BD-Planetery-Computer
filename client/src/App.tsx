import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import FloodMonitoring from "@/pages/FloodMonitoring";
import ClimateData from "@/pages/ClimateData";
import SatelliteImagery from "@/pages/SatelliteImagery";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/flood" component={FloodMonitoring} />
      <Route path="/cyclone" component={() => <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Cyclone Tracking</h1>
        <p className="text-muted-foreground">Real-time cyclone monitoring and historical track analysis (Coming Soon)</p>
      </div>} />
      <Route path="/climate" component={ClimateData} />
      <Route path="/landuse" component={() => <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Land Use Analysis</h1>
        <p className="text-muted-foreground">Agricultural, urban, and forest land classification (Coming Soon)</p>
      </div>} />
      <Route path="/borders" component={() => <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Border Regions</h1>
        <p className="text-muted-foreground">Cross-border environmental monitoring and regional analysis (Coming Soon)</p>
      </div>} />
      <Route path="/reports" component={SatelliteImagery} />
      <Route path="/settings" component={() => <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure dashboard preferences and data sources (Coming Soon)</p>
      </div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between px-4 py-2 border-b">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-hidden">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
