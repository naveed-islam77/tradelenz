"use client";
import { Empty } from "@/components/ui/empty";
import { Trade } from "@/types/trade-form";
import { TradeCard } from "./trade-card";

export function TradesGrid({ trades }: { trades: Trade[] }) {
  if (!trades || trades.length === 0) {
    return <Empty title="No trades yet" />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {trades.map((trade) => (
        <TradeCard key={trade.id} trade={trade} />
      ))}
    </div>
  );
}
