import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg px-6 py-3 flex items-center">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-sm font-semibold text-foreground tracking-tight">
              Smart ATS <span className="text-primary">— AI Copilot</span>
            </h1>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
