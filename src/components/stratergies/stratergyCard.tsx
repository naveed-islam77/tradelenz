"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeleteStrategyMutation } from "@/redux/services/stratergy";
import { Delete, Loader, Loader2, Trash2, TrendingUp } from "lucide-react";

interface StrategyCardProps {
  strategy: {
    id: string;
    name: string;
    total_trades: number;
    wins: number;
    losses: number;
  };
  onEdit: (id: string) => void;
}

export function StrategyCard({ strategy, onEdit }: StrategyCardProps) {
  const [deleteStrategy, { isLoading }] = useDeleteStrategyMutation();
  const winRate =
    strategy.total_trades > 0
      ? ((strategy.wins / strategy.total_trades) * 100).toFixed(1)
      : 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  }

  return (
    <Card className="bg-card border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer group">
      <div className="flex flex-col gap-4">
        {/* Header with Name and Win Rate Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
              {strategy.name}
            </h3>
          </div>
          {/* Win Rate Badge - Highlighted */}
          <div
            title="Delete Strategy"
            onClick={() => deleteStrategy(strategy?.id)}
          >
            <Trash2 className="text-red-500" size={20} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Trades */}
          <div className="bg-secondary/5 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">
              Total Trades
            </div>
            <div className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              {strategy.total_trades}
            </div>
          </div>

          {/* Wins */}
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <div className="text-xs text-muted-foreground mb-1">Wins</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {strategy.wins}
            </div>
          </div>

          {/* Losses */}
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <div className="text-xs text-muted-foreground mb-1">Losses</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {strategy.losses}
            </div>
          </div>

          {/* Win/Loss Ratio */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1 text-right whitespace-nowrap">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-lg font-bold text-primary">{winRate}%</div>
          </div>
        </div>

        {/* Edit Button */}
        <Button
          onClick={() => onEdit(strategy.id)}
          variant="outline"
          size="sm"
          className="w-full mt-2 hover:bg-primary/10"
        >
          Edit Strategy
        </Button>
      </div>
    </Card>
  );
}
