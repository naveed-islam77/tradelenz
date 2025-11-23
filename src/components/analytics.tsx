"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useGetTradesQuery } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Analytics() {
  const { data: trades } = useGetTradesQuery({});

  if (!trades) return null;
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t: Trade) => Number(t.result) > 0);
  const losingTrades = trades.filter((t: Trade) => Number(t.result) < 0);
  const breakEvenTrades = trades.filter((t: Trade) => Number(t.result) === 0);

  const winCount = winningTrades.length;
  const lossCount = losingTrades.length;
  const breakEvenCount = breakEvenTrades.length;

  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;

  const totalProfit = winningTrades.reduce(
    (sum: number, t: Trade) => sum + t.result,
    0
  );
  const totalLoss = Math.abs(
    losingTrades.reduce((sum: number, t: Trade) => sum + t.result, 0)
  );
  const netProfit = trades.reduce((sum: number, t: Trade) => sum + t.result, 0);

  const avgWin = winCount > 0 ? totalProfit / winCount : 0;
  const avgLoss = lossCount > 0 ? totalLoss / lossCount : 0;

  const winLossData = [
    { name: "Wins", value: winCount, color: "hsl(var(--chart-1))" },
    { name: "Losses", value: lossCount, color: "hsl(var(--chart-3))" },
    ...(breakEvenCount > 0
      ? [
          {
            name: "Break Even",
            value: breakEvenCount,
            color: "hsl(var(--chart-4))",
          },
        ]
      : []),
  ];

  const avgWinLossData = [
    { name: "Avg Win", value: Math.round(avgWin) },
    { name: "Avg Loss", value: Math.round(avgLoss) },
  ];

  const pnlData = [
    { name: "Total Wins", value: Math.round(totalProfit) },
    { name: "Total Losses", value: -Math.round(totalLoss) },
  ];

  const colors = {
    win: "hsl(var(--chart-1))",
    loss: "hsl(var(--chart-3))",
    breakEven: "hsl(var(--chart-4))",
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-black/80">
            {winRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">{winCount} wins</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-foreground">{totalTrades}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {lossCount} losses
          </p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground mb-1">Avg Win</p>
          <p className="text-2xl font-bold text-accent">${avgWin.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">per trade</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground mb-1">Avg Loss</p>
          <p className="text-2xl font-bold text-destructive">
            ${avgLoss.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">per trade</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Win/Loss Ratio Pie Chart */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Win/Loss Ratio
          </h3>
          <ChartContainer
            config={{
              wins: {
                label: "Wins",
                color: "hsl(var(--chart-1))",
              },
              losses: {
                label: "Losses",
                color: "hsl(var(--chart-3))",
              },
              breakEven: {
                label: "Break Even",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={
                    <ChartTooltipContent className="bg-[#D6F599] text-black" />
                  }
                />
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name} ${value} (${(percent || 0 * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Profit & Loss Summary
          </h3>
          <ChartContainer
            config={{
              totalWins: {
                label: "Total Wins",
                color: "hsl(var(--chart-1))",
              },
              totalLosses: {
                label: "Total Losses",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pnlData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={
                    <ChartTooltipContent className="bg-[#D6F599] text-black" />
                  }
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {pnlData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > 0 ? colors.win : colors.loss}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex justify-between items-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
            <p
              className={`text-2xl font-bold ${
                netProfit >= 0 ? "text-accent" : "text-destructive"
              }`}
            >
              {netProfit >= 0 ? "+" : ""}${netProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
