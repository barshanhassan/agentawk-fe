import { useState } from "react";
import CustomDropdown from "@/components/CustomDropdown";
import BotDashboardContent from "./bot-dashboard/BotDashboardContent";

// Bot selector options — should be fetched from workspace's actual bots once
// `GET /api/workspace/bots` is wired. Empty by default for fresh workspaces.
const botOptions: Array<{ id: string; name: string }> = [];

export default function BotDashboardTab() {
  const [selectedBots, setSelectedBots] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Dashboard Content */}
      <BotDashboardContent />
    </div>
  );
}

