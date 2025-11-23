import { useState } from "react";
import TimeFrameTab from "./timeframe-tab";
import SessionTab from "./session-tab";
import TradeTypeTab from "./trade-type-tab";

export default function Progress() {
  const [activeTab, setActiveTab] = useState("timeframe");

  const tabs = [
    { id: "timeframe", label: "Timeframe Summary" },
    { id: "tradetype", label: "Trade Type Summary" },
    { id: "session", label: "Session Summary" },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Trading Analytics
          </h1>
          <p className="text-slate-400">
            Performance summary across timeframes, strategies, and sessions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold text-sm transition-all duration-300 relative ${
                activeTab === tab.id
                  ? "text-white bg-accent rounded-md"
                  : "text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "timeframe" && <TimeFrameTab />}
          {activeTab === "tradetype" && <TradeTypeTab />}
          {activeTab === "session" && <SessionTab />}
        </div>
      </div>
    </main>
  );
}
