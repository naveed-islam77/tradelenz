"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/stratergies/stratergyCard";
import { Plus } from "lucide-react";
import { useGetStrategiesQuery } from "@/redux/services/stratergy";

interface Strategy {
  id: string;
  name: string;
  total_trades: number;
  wins: number;
  losses: number;
}

export function StrategiesPage() {
  const router = useRouter();
  const { data } = useGetStrategiesQuery({});

  const strategies: Strategy[] = data || [];

  // const [strategies] = useState<Strategy[]>([
  //   {
  //     id: "1",
  //     name: "Moving Average Crossover",
  //     totalTrades: 156,
  //     wins: 98,
  //     losses: 58,
  //   },
  //   {
  //     id: "2",
  //     name: "RSI Oversold",
  //     totalTrades: 89,
  //     wins: 65,
  //     losses: 24,
  //   },
  //   {
  //     id: "3",
  //     name: "Breakout Strategy",
  //     totalTrades: 203,
  //     wins: 112,
  //     losses: 91,
  //   },
  //   {
  //     id: "4",
  //     name: "Mean Reversion",
  //     totalTrades: 124,
  //     wins: 84,
  //     losses: 40,
  //   },
  // ]);

  const handleAddStrategy = () => {
    router.push("/strategy/create");
  };

  const handleEditStrategy = (id: string) => {
    router.push(`/strategy/${id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Strategies
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your trading strategies
          </p>
        </div>
        <Button
          onClick={handleAddStrategy}
          className="gap-2 bg-accent hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Add Strategy
        </Button>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onEdit={handleEditStrategy}
          />
        ))}
      </div>

      {/* Empty State */}
      {strategies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No strategies yet</p>
            <Button onClick={handleAddStrategy}>
              Create Your First Strategy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
