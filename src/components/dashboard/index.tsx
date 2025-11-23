import { useGetTradesQuery } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import { DollarSign, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DashboardHeader from "./dashboard-header";
import { TradesGrid } from "./trades-grid";

const DashboardTab = () => {
  const [filter, setFilter] = useState({});
  const finalFilter = Object.keys(filter).length === 0 ? "week" : filter;
  const { data: trades = [] } = useGetTradesQuery({ filter: finalFilter });

  const totalTrades = trades.length;
  const totalPnL = trades.reduce((sum: number, t: Trade) => sum + t.result, 0);
  const winningTrades = trades.filter(
    (t: Trade) => Number(t.result) > 0
  ).length;
  const winRate =
    totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          View your trading performance and detailed trade history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Trades */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trades
              </CardTitle>
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalTrades}</p>
          </CardContent>
        </Card>

        {/* Total P&L */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L
              </CardTitle>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                totalPnL >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              ${Math.abs(totalPnL).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPnL >= 0 ? "+" : "-"}
              {Math.abs(totalPnL).toFixed(0)}
            </p>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{winRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {winningTrades} winning trades
            </p>
          </CardContent>
        </Card>

        {/* Avg Return */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Return
              </CardTitle>
              {totalTrades > 0 && totalPnL / totalTrades >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                totalTrades > 0 && totalPnL / totalTrades >= 0
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            >
              ${totalTrades > 0 ? (totalPnL / totalTrades).toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">per trade</p>
          </CardContent>
        </Card>
      </div>

      {/* Trades Section */}
      <div>
        <DashboardHeader
          onFilter={(field: any, value: any) => setFilter({ field, value })}
        />

        {trades?.length > 0 ? (
          <TradesGrid trades={trades} />
        ) : (
          <div className="text-center py-10 text-muted-foreground flex justify-center items-center flex-col h-[40vh]">
            <p className="text-lg font-semibold">No trades Yet</p>
            <p className="text-sm">You have not taken any trade in this week</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
