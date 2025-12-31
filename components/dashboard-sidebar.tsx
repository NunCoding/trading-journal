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
  DollarSign,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {authService} from '@/lib/auth'
import { useRouter } from "next/navigation"

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
import { Button } from "./ui/button"

const navItems = [
  { title: "Dashboard", href: "/dashboards/dashboard", icon: LayoutDashboard },
  { title: "Trade List", href: "/dashboards/trades", icon: ListOrdered },
  { title: "Add Trade", href: "/dashboards/trades/new", icon: PlusCircle },
  { title: "Analytics", href: "/dashboards/analytics", icon: BarChart3 },
  { title: "Strategies", href: "/dashboards/strategies", icon: Target },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const route = useRouter()
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
              <Link href="/dashboards/dashboards">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <DollarSign className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl">
                    Trading Journal
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    Professional Edition
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="py-5"
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span className="text-md">{item.title}</span>
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
          <SidebarMenuItem>
            <SidebarMenuButton
            onClick={() => authService.logout()}
              tooltip="Logout"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
