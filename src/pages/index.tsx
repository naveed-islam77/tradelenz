"use client";

import AllTimeTrades from "@/components/all-time";
import Analytics from "@/components/analytics";
import DashboardTab from "@/components/dashboard";
import History from "@/components/history";
import Progress from "@/components/progress";
import Sidebar from "@/components/sidebar";
import { StrategiesPage } from "@/components/stratergies";
import TradeForm from "@/components/trade-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("add-trade");

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as string);
    }
  }, [router.query.tab]);

  return (
    <div className="flex bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8">
          {/* Left Section - Form */}
          <div className="flex-1 min-w-0">
            {activeTab === "add-trade" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Add Trade
                  </h1>
                  <p className="text-muted-foreground">
                    Log a new trade and track your performance
                  </p>
                </div>
                <TradeForm />
              </div>
            )}

            {activeTab === "dashboard" && <DashboardTab />}

            {activeTab === "history" && <History />}
            {activeTab === "alltime-trades" && <AllTimeTrades />}
            {activeTab === "strategy" && <StrategiesPage />}
            {activeTab === "progress" && <Progress />}

            {activeTab === "analytics" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Analyze your trading performance and statistics
                  </p>
                </div>
                <Analytics />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
