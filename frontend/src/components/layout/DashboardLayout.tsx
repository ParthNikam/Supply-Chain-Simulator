"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Menu, Settings } from "lucide-react";
import Link from "next/link";


function SidebarLink({icon,label,href,collapsed,}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
}) {
  return (
    <Link
        href={href}
      className={cn(
        "flex items-center w-full rounded-md p-2 text-sm hover:bg-gray-800 transition-colors",
        collapsed ? "justify-center" : "justify-start space-x-3"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}



export default function DashboardLayout({children,}: {children: React.ReactNode;}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && <span className="text-2xl font-semibold">Kinesis</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          >
            <Menu />
          </Button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-2 px-2">
          <SidebarLink href='/dashboard' icon={<Home />} label="Home" collapsed={collapsed} />
          <SidebarLink href='settings' icon={<Settings />} label="Settings" collapsed={collapsed} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{children}</main>
    </div>
  );
}

