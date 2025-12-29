"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  LayoutDashboard,
  ListOrdered,
  Moon,
  PlusCircle,
  Settings,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/dashboards/dashboard", icon: LayoutDashboard },
  { title: "Trade List", href: "/dashboards/trades", icon: ListOrdered },
  { title: "Add Trade", href: "/dashboards/trades/new", icon: PlusCircle },
  { title: "Analytics", href: "/dashboards/analytics", icon: BarChart3 },
  { title: "Strategies", href: "/dashboards/strategies", icon: Target },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-balance">
                    Trading Journal
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Professional Edition
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled={!mounted}
              onClick={() =>
                mounted &&
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              tooltip={
                mounted
                  ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`
                  : "Theme"
              }
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )
              ) : (
                <span className="size-4" />
              )}

              <span>
                {mounted
                  ? resolvedTheme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"
                  : "Theme"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              tooltip="Settings"
            >
              <Link href="/dashboards/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
