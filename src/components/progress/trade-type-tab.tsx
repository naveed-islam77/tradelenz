"use client";

import { useGetTradeTypeAnalyticsQuery } from "@/redux/services/tradesApi";
import { AnalyticsCard } from "./analytics-card";
import { TrendChart } from "./trend-chart";
import { Zap, Flame, TrendingUp, Target } from "lucide-react";

export default function TradeTypeTab() {
  const { data: tradeTypeData } = useGetTradeTypeAnalyticsQuery({});

  console.log("tradeTypeData", tradeTypeData);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tradeTypeData?.map((data: any) => {
        // const Icon = data.icon;
        return (
          <AnalyticsCard
            key={data?.tradetype}
            title={data?.tradetype}
            trades={data.trades}
            wins={data.wins}
            losses={data.losses}
            winRate={data.winRate}
            trend={<TrendChart data={data.trend} />}
            performanceLevel={getPerformanceLevel(data.winRate)}
            // icon={<Icon className={`w-6 h-6 ${data.color}`} />}
          />
        );
      })}
    </div>
  );
}

function getPerformanceLevel(winRate: number): "high" | "medium" | "low" {
  if (winRate >= 60) return "high";
  if (winRate >= 50) return "medium";
  return "low";
}
