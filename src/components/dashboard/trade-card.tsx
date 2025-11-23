import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDeleteTradeMutation } from "@/redux/services/tradesApi";
import { Trade } from "@/types/trade-form";
import { Loader2, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export function TradeCard({ trade }: { trade: Trade }) {
  const result = Number(trade.result);
  const isProfit = result >= 0;

  const [deleteTrade, { isLoading }] = useDeleteTradeMutation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  }

  return (
    <Link href={`/trades/${trade.id}`}>
      <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3
                className={cn(
                  "text-lg font-bold text-white p-2 rounded-full w-[100px] text-center",
                  trade.type === "buy" ? "bg-accent" : "bg-destructive"
                )}
              >
                {trade.type}
              </h3>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteTrade(trade.id);
              }}
            >
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price and Quantity Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Entry</p>
              <p className="font-semibold text-foreground">${trade.entry}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Exit</p>
              <p className="font-semibold text-foreground">
                {trade.exit ? `$${trade.exit}` : "Pending"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Quantity</p>
              <p className="font-semibold text-foreground">{trade.lot_size}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="font-semibold text-foreground text-sm">
                {new Date(trade.date_open).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* P&L Section */}
          <div
            className={`rounded-lg p-4 ${
              isProfit
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Profit/Loss
                </p>
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-2xl font-bold ${
                      isProfit ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    ${Math.abs(result).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                {isProfit ? (
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* View Details */}
          <p className="text-xs text-primary font-medium">View Details →</p>
        </CardContent>
      </Card>
    </Link>
  );
}
