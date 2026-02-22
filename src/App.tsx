import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardView } from "./components/DashboardView";
import { JobsView } from "./components/JobsView";
import { PipelineView } from "./components/PipelineView";
import { SettingsView } from "./components/SettingsView";
import { ResumeUploadView } from "./components/ResumeUploadView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route index element={<DashboardView />} />
            <Route path="jobs" element={<JobsView />} />
            <Route path="jobs/:jobId" element={<PipelineView />} />
            <Route path="upload" element={<ResumeUploadView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
