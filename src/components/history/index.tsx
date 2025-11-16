import { useGetTradesQuery } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import React from "react";

const History = () => {
  const { data: trades } = useGetTradesQuery({});
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Trade History
        </h1>
        <p className="text-muted-foreground">Review all your past trades</p>
      </div>
      <div className="space-y-3">
        {trades.map((trade: Trade) => (
          <div
            key={trade.id}
            className="bg-card rounded-lg p-4 shadow-sm border border-border cursor-pointer hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    trade.type === "buy" ? "bg-accent" : "bg-destructive"
                  }`}
                />
                <div>
                  <p className="font-semibold text-foreground">{trade.pair}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trade?.date_open || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    trade.result > 0 ? "text-accent" : "text-destructive"
                  }`}
                >
                  ${trade.result}
                </p>
                <p className="text-sm text-muted-foreground">
                  {trade.pips > 0 ? "+" : ""}
                  {trade.pips} pips
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
