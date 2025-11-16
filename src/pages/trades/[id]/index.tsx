"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetTradeByIdQuery } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";

export default function TradeDetailsPage() {
  const router = useRouter();
  const params = router.query;
  const { data } = useGetTradeByIdQuery(params.id as string);

  const trade: Trade = data;

  if (!trade) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Card className="border-border bg-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">Trade not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const result = Number(trade.result);
  const isProfit = result >= 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div onClick={() => router.back()}>
          <Button variant="outline" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header Card */}
        <Card className="border-border bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <div className="flex items-center gap-2 justify-between ">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3
                    className={cn(
                      "text-lg font-bold text-white p-2 rounded-full w-[100px] text-center",
                      trade.type === "buy" ? "bg-accent" : "bg-destructive"
                    )}
                  >
                    {trade.type}
                  </h3>

                  <Badge
                    variant="outline"
                    className={`${
                      trade.type === "buy"
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    Closed
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Trade Pair: {trade.pair}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  trade.type === "buy" ? "bg-blue-500/10" : "bg-red-500/10"
                }`}
              >
                {trade.type === "buy" ? (
                  <ArrowUpRight className="w-8 h-8 text-blue-500" />
                ) : (
                  <ArrowDownLeft className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* P&L Summary Card */}
        <Card
          className={`border-2 ${
            isProfit
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Profit/Loss
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isProfit ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isProfit ? "+" : "-"}${Math.abs(result).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                {isProfit ? (
                  <TrendingUp className="w-12 h-12 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Entry Details */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Entry Price</span>
                <span className="font-semibold text-foreground text-lg">
                  ${trade.entry}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Entry Date</span>
                <span className="font-semibold text-foreground">
                  {dayjs(trade.date_open).format("YYYY-MM-DD")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-semibold text-foreground">
                  {dayjs(trade.date_open).format("hh:mm A")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Exit Details */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Exit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Exit Price</span>
                <span className="font-semibold text-foreground text-lg">
                  {trade.exit ? `$${trade.exit}` : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Exit Date</span>
                <span className="font-semibold text-foreground">
                  {trade.date_close
                    ? dayjs(trade.date_close).format("YYYY-MM-DD")
                    : "Open"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold text-foreground">
                  {trade.date_close
                    ? `${dayjs(trade.date_close).diff(
                        dayjs(trade.date_open),
                        "day"
                      )} days`
                    : "Ongoing"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Calculation Details */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trade Calculation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-border md:border-b-0">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-semibold text-foreground text-lg">
                  {trade.lot_size}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border md:border-b-0">
                <span className="text-muted-foreground">Price Difference</span>
                <span
                  className={`font-semibold text-lg ${
                    isProfit ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isProfit ? "+" : "-"}$
                  {Math.abs(trade.exit ? trade.exit - trade.entry : 0).toFixed(
                    2
                  )}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-foreground">Total P&L</span>
                <span
                  className={`font-bold text-xl ${
                    isProfit ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isProfit ? "+" : "-"}${Math.abs(result).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmations  */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trade?.confirmations?.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                >
                  {c}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        {trade.notes && (
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trade Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {trade.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
