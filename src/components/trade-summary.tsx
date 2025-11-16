"use client";

interface Trade {
  id: string;
  date: string;
  pair: string;
  type: "buy" | "sell";
  entryPrice: number;
  exitPrice: number;
  sl: number;
  tp: number;
  lotSize: number;
  result: number;
  pips: number;
  setup: string;
  notes: string;
  screenshot?: string;
}

interface TradeSummaryProps {
  trade: Trade;
}

export default function TradeSummary({ trade }: TradeSummaryProps) {
  const profitLoss = trade.result;
  const isProfitable = profitLoss >= 0;

  return (
    <div className="sticky top-8 space-y-4">
      {/* Main Summary Card */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-muted p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">
              {trade.pair}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                trade.type === "buy"
                  ? "bg-accent text-accent-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {trade.type === "buy" ? "↑ BUY" : "↓ SELL"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(trade.date).toLocaleDateString()} at{" "}
            {new Date(trade.date).toLocaleTimeString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* P&L */}
          <div className="pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Profit/Loss</p>
            <p
              className={`text-2xl font-bold ${
                isProfitable ? "text-accent" : "text-destructive"
              }`}
            >
              {isProfitable ? "+" : ""}${profitLoss}
            </p>
            <p
              className={`text-xs font-semibold ${
                isProfitable ? "text-accent" : "text-destructive"
              }`}
            >
              {trade.pips > 0 ? "+" : ""}
              {trade.pips} pips
            </p>
          </div>

          {/* Price Levels */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="text-sm font-semibold text-foreground">
                {trade.entryPrice.toFixed(4)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Exit</p>
              <p className="text-sm font-semibold text-foreground">
                {trade.exitPrice.toFixed(4)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Stop Loss</p>
              <p className="text-sm font-semibold text-destructive">
                {trade.sl.toFixed(4)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Take Profit</p>
              <p className="text-sm font-semibold text-accent">
                {trade.tp.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Trade Details */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Lot Size</p>
              <p className="text-sm font-semibold text-foreground">
                {trade.lotSize}
              </p>
            </div>
            {trade.setup && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Setup</p>
                <p className="text-sm font-semibold text-foreground">
                  {trade.setup}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {trade.notes && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Notes</p>
              <p className="text-xs text-foreground leading-relaxed bg-muted p-2 rounded">
                {trade.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Management Stats */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Risk / Reward
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Risk</p>
            <p className="text-sm font-semibold text-destructive">
              $
              {(
                Math.abs(trade.entryPrice - trade.sl) *
                trade.lotSize *
                10000 *
                10
              ).toFixed(0)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Reward</p>
            <p className="text-sm font-semibold text-accent">
              $
              {(
                Math.abs(trade.tp - trade.entryPrice) *
                trade.lotSize *
                10000 *
                10
              ).toFixed(0)}
            </p>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">R:R Ratio</p>
            <p className="text-sm font-semibold text-foreground">
              {(
                Math.abs(trade.tp - trade.entryPrice) /
                Math.abs(trade.entryPrice - trade.sl)
              ).toFixed(2)}
              :1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
