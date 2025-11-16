import { useGetTradesQuery } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { TradesGrid } from "./trades-grid";

const DashboardTab = () => {
  const { data: trades = [] } = useGetTradesQuery({});

  const totalTrades = trades.length;
  const totalPnL = trades.reduce((sum: number, t: Trade) => sum + t.result, 0);
  const winningTrades = trades.filter(
    (t: Trade) => Number(t.result) > 0
  ).length;
  const winRate =
    totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

  if (trades?.length === 0) return null;
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            All Trades
          </h2>
          <p className="text-muted-foreground">
            Click on any trade to see detailed information
          </p>
        </div>
        <TradesGrid trades={trades} />
      </div>
    </div>
  );
};

export default DashboardTab;
