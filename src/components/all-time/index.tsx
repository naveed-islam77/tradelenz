import { useGetTradesByPaginationQuery } from "@/redux/services/tradesApi";
import { DollarSign, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { TradesGrid } from "../dashboard/trades-grid";
import { PaginationComponent } from "../pagination";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MonthYearPicker from "../month-year-picker";

const AllTimeTrades = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [monthYear, setMonthYear] = useState("");

  const { data } = useGetTradesByPaginationQuery({
    page,
    limit,
    monthYear,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.total / limit));
      setPage(data?.page);
      setLimit(data?.limit);
    }
  }, [data, limit]);

  const trades = data?.data;

  const totalTrades = data?.total;
  const totalPnL = data?.totalPL;
  const winningTrades = data?.wins;
  const winRate = data?.winRate;

  return (
    <div>
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
              <p className="text-3xl font-bold text-foreground">
                {totalTrades}
              </p>
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
                $
                {totalTrades > 0 ? (totalPnL / totalTrades).toFixed(2) : "0.00"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">per trade</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center my-3">
            <h1 className="text-3xl font-bold text-foreground mb-2 w-full">
              All Time Trades
            </h1>
            <MonthYearPicker date={monthYear} setDate={setMonthYear} />
          </div>
          {trades?.length > 0 ? (
            <TradesGrid trades={trades} />
          ) : (
            <div className="text-center py-10 text-muted-foreground flex justify-center items-center flex-col h-[40vh]">
              <p className="text-lg font-semibold">No trades Yet</p>
              <p className="text-sm">You have not taken any trades Yet</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AllTimeTrades;
