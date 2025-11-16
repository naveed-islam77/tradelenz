"use client";

import {
  LayoutDashboard,
  Plus,
  History,
  TrendingUp,
  Settings,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-trade", label: "Add Trade", icon: Plus },
    { id: "history", label: "Trade History", icon: History },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={500}
          height={500}
          className="w-full h-32 object-cover"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Professional Trading Journal
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#003250] text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
