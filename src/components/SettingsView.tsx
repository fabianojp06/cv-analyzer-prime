import { Settings } from "lucide-react";

export function SettingsView() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
        <Settings className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground mt-1">Esta seção está em construção.</p>
      </div>
    </div>
  );
}
