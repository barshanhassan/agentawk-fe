import { useState } from "react";
import CustomDropdown from "@/components/CustomDropdown";
import BotDashboardContent from "./bot-dashboard/BotDashboardContent";

const botOptions = [
  { id: "bot-1", name: "Bot Alpha" },
  { id: "bot-2", name: "Bot Beta" },
  { id: "bot-3", name: "Bot Gamma" },
  { id: "bot-4", name: "Bot Delta" },
  { id: "bot-5", name: "Bot Epsilon" },
];

export default function BotDashboardTab() {
  const [selectedBots, setSelectedBots] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Dashboard Content */}
      <BotDashboardContent />
    </div>
  );
}

