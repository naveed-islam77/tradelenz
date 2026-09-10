"use client";

import {
  ChartCandlestick,
  History,
  HistoryIcon,
  LayoutDashboard,
  Moon,
  Plus,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiStockFill } from "react-icons/ri";
import { PiStrategyFill } from "react-icons/pi";
import { Button } from "./ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-trade", label: "Add Trade", icon: Plus },
    { id: "history", label: "Today Trades", icon: RiStockFill },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "strategy", label: "Strategies", icon: PiStrategyFill },
    { id: "progress", label: "Progress Cards", icon: ChartCandlestick },
    { id: "alltime-trades", label: "All Time Trades", icon: HistoryIcon },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      {/* <div className="p-6 border-b border-sidebar-border">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={500}
          height={500}
          className="w-full h-32 object-cover"
        />
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Professional Trading Journal
        </p>
      </div> */}

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                router.push(`?tab=${item.id}`);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-accent text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full h-10"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
