import type { ReactNode } from "react"
import { useState } from "react"
import {
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  MoonStar,
  Shield,
  SunMedium,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { FloatingDock } from "@/components/ui/floating-dock"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useAppState } from "@/lib/app-state"
import { type AppRoute, navigate } from "@/lib/navigation"

type AppShellProps = {
  currentRoute: AppRoute
  children: ReactNode
  headerLeading?: ReactNode
  headerContent?: ReactNode
}

const navItems = [
  { label: "控制台", route: "/app" as const, icon: LayoutGrid },
  { label: "邮箱页", route: "/mailboxes" as const, icon: Mail },
  { label: "管理页", route: "/admin" as const, icon: Shield },
]

export function AppShell({
  currentRoute,
  children,
  headerLeading,
  headerContent,
}: AppShellProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { logout, session } = useAppState()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const visibleNavItems = navItems.filter((item) =>
    item.route === "/admin" ? session?.role === "admin" : true,
  )
  const dockItems = [
    ...visibleNavItems.map((item) => {
      const Icon = item.icon
      return {
        title: item.label,
        active: currentRoute === item.route,
        onClick: () => navigate(item.route),
        icon: <Icon className="h-full w-full text-current" />,
      }
    }),
    {
      title: resolvedTheme === "dark" ? "浅色模式" : "深色模式",
      onClick: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      icon:
        resolvedTheme === "dark" ? (
          <SunMedium className="h-full w-full text-current" />
        ) : (
          <MoonStar className="h-full w-full text-current" />
        ),
    },
    {
      title: "退出登录",
      onClick: () => void logout(),
      icon: <LogOut className="h-full w-full text-current" />,
    },
  ]

  return (
    <div className="relative flex h-svh overflow-hidden bg-background text-foreground">
      <div className="flex h-svh w-full overflow-hidden p-0 lg:p-4 lg:pb-22">
        <div className="mx-auto flex h-full w-full max-w-[1480px] overflow-hidden bg-card lg:rounded-[28px] lg:border lg:border-border lg:shadow-[0_18px_60px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="border-b border-border bg-background/88 backdrop-blur supports-[backdrop-filter]:bg-background/72">
              <div className="flex items-center gap-3 px-3 py-3 md:px-4">
                <div className="flex min-w-0 items-center gap-2 md:w-[280px] md:gap-3">
                  {headerLeading}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-sm font-semibold text-foreground">
                        CloudflareMail
                      </div>
                      <div className="text-[11px] text-muted-foreground">Workspace</div>
                    </div>
                  </div>
                </div>

                {headerContent ? (
                  <div className="hidden min-w-0 flex-1 md:flex">{headerContent}</div>
                ) : (
                  <div className="hidden flex-1 md:block" />
                )}

                <div className="ml-auto flex items-center gap-2 md:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    {resolvedTheme === "dark" ? (
                      <SunMedium className="h-3.5 w-3.5" />
                    ) : (
                      <MoonStar className="h-3.5 w-3.5" />
                    )}
                    <span>{resolvedTheme === "dark" ? "Light" : "Dark"}</span>
                  </button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => void logout()}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setMobileMenuOpen((value) => !value)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {headerContent ? (
                <div className="border-t border-border px-3 pb-3 pt-3 md:hidden">
                  {headerContent}
                </div>
              ) : null}
            </header>

            <main className="min-w-0 flex-1 overflow-hidden bg-background">
              {children}
            </main>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 hidden justify-center px-4 md:flex">
        <FloatingDock
          items={dockItems}
          showMobile={false}
          desktopClassName="pointer-events-auto"
        />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[260px] border-l bg-popover p-0 text-popover-foreground">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Workspace</SheetTitle>
            <SheetDescription>页面导航与会话操作</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-3">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => {
                    navigate(item.route)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    currentRoute === item.route
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => {
                void logout()
                setMobileMenuOpen(false)
              }}
              className="mt-2 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
