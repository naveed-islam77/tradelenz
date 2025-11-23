import { useGetSessionAnalyticsQuery } from "@/redux/services/tradesApi";
import { AnalyticsCard } from "./analytics-card";
import { TrendChart } from "./trend-chart";

export default function SessionTab() {
  const { data: sessionData } = useGetSessionAnalyticsQuery({});

  console.log("sessionData", sessionData);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sessionData?.map((data: any) => (
        <AnalyticsCard
          key={data?.session}
          title={data?.session}
          trades={data.trades}
          wins={data.wins}
          losses={data.losses}
          winRate={data.winRate}
          trend={<TrendChart data={data.trend} />}
          performanceLevel={getPerformanceLevel(data.winRate)}
        />
      ))}
    </div>
  );
}

function getPerformanceLevel(winRate: number): "high" | "medium" | "low" {
  if (winRate >= 60) return "high";
  if (winRate >= 50) return "medium";
  return "low";
}
