import { useGetTimeframeAnalyticsQuery } from "@/redux/services/tradesApi";
import { AnalyticsCard } from "./analytics-card";
import { TrendChart } from "./trend-chart";

// const timeframeData = [
//   {
//     timeframe: "M1",
//     trades: 245,
//     wins: 156,
//     losses: 89,
//     winRate: 52.7,
//     trend: [62, 64, 63, 65, 64, 63, 62],
//   },
//   {
//     timeframe: "M5",
//     trades: 189,
//     wins: 128,
//     losses: 61,
//     winRate: 67.7,
//     trend: [66, 68, 67, 69, 70, 69, 68],
//   },
//   {
//     timeframe: "M15",
//     trades: 156,
//     wins: 112,
//     losses: 44,
//     winRate: 71.8,
//     trend: [70, 72, 71, 73, 74, 75, 72],
//   },
//   {
//     timeframe: "H1",
//     trades: 98,
//     wins: 75,
//     losses: 23,
//     winRate: 76.5,
//     trend: [74, 76, 77, 78, 77, 76, 75],
//   },
//   {
//     timeframe: "H4",
//     trades: 54,
//     wins: 45,
//     losses: 9,
//     winRate: 83.3,
//     trend: [81, 82, 84, 85, 84, 83, 82],
//   },
//   {
//     timeframe: "D1",
//     trades: 28,
//     wins: 25,
//     losses: 3,
//     winRate: 89.3,
//     trend: [87, 88, 90, 91, 89, 88, 87],
//   },
// ];

export default function TimeframeTab() {
  const { data: timeframeData } = useGetTimeframeAnalyticsQuery({});

  console.log("timeframeData", timeframeData);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {timeframeData?.map((data: any) => (
        <AnalyticsCard
          key={data.timeframe}
          title={data.timeframe}
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
