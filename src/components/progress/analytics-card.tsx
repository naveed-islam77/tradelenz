"use client";

import type { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  trend: ReactNode;
  performanceLevel: "high" | "medium" | "low";
  icon?: ReactNode;
}

export function AnalyticsCard({
  title,
  trades,
  wins,
  losses,
  winRate,
  trend,
  performanceLevel,
  icon,
}: AnalyticsCardProps) {
  const getAccentColor = () => {
    if (performanceLevel === "high") return "text-accent";
    if (performanceLevel === "medium") return "text-yellow-300";
    return "text-red-400";
  };

  return (
    <div
      className={`group relative rounded-2xl backdrop-blur-xl border p-6 transition-all duration-300 hover:scale-[1.01] cursor-pointer overflow-hidden`}
    >
      {/* Gradient background glow */}
      <div className="absolute -inset-32 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-accent via-transparent to-transparent blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">Trading Performance</p>
          </div>
          {icon && (
            <div className="opacity-80 group-hover:opacity-100 transition-opacity">
              {icon}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">
              TOTAL TRADES
            </p>
            <p className="text-2xl font-bold text-foreground">{trades}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">
              WIN RATE
            </p>
            <p className={`text-2xl font-bold ${getAccentColor()}`}>
              {winRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">WINS</p>
            <p className="text-lg font-semibold text-emerald-400">{wins}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">LOSSES</p>
            <p className="text-lg font-semibold text-red-400">{losses}</p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mb-4 opacity-80">{trend}</div>

        {/* Win Rate Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Performance</span>
            <span className="text-xs font-semibold text-slate-400">
              {winRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-500 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                performanceLevel === "high"
                  ? "from-emerald-400 to-emerald-500"
                  : performanceLevel === "medium"
                  ? "from-yellow-300 to-yellow-400"
                  : "from-red-400 to-red-500"
              }`}
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
