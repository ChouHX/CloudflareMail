"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Eye, EyeOff, MoonStar, SunMedium, User } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { useTheme } from "@/components/theme-provider"

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ")
}

interface TravelSigninProps {
  error?: string
  username: string
  password: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onGuestLogin: () => void
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variantStyles = {
    default:
      "bg-primary bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
      {...props}
    />
  )
}

type RoutePoint = {
  x: number
  y: number
  delay: number
}

type DotPoint = {
  x: number
  y: number
  radius: number
  opacity: number
}

const DotMap = ({ dark }: { dark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const routes = useMemo<{ start: RoutePoint; end: RoutePoint; color: string }[]>(
    () => [
      {
        start: { x: 100, y: 150, delay: 0 },
        end: { x: 200, y: 80, delay: 2 },
        color: dark ? "rgba(125, 142, 166, 0.52)" : "rgba(99, 124, 167, 0.34)",
      },
      {
        start: { x: 200, y: 80, delay: 2 },
        end: { x: 260, y: 120, delay: 4 },
        color: dark ? "rgba(125, 142, 166, 0.52)" : "rgba(99, 124, 167, 0.34)",
      },
      {
        start: { x: 50, y: 50, delay: 1 },
        end: { x: 150, y: 180, delay: 3 },
        color: dark ? "rgba(125, 142, 166, 0.52)" : "rgba(99, 124, 167, 0.34)",
      },
      {
        start: { x: 280, y: 60, delay: 0.5 },
        end: { x: 180, y: 180, delay: 2.5 },
        color: dark ? "rgba(125, 142, 166, 0.52)" : "rgba(99, 124, 167, 0.34)",
      },
    ],
    [dark],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
      canvas.width = width
      canvas.height = height
    })

    resizeObserver.observe(canvas.parentElement)
    return () => resizeObserver.disconnect()
  }, [])

  const dots = useMemo(() => {
    if (!dimensions.width || !dimensions.height) {
      return [] as DotPoint[]
    }

    const result: DotPoint[] = []
    const gap = 12
    const dotRadius = 1

    for (let x = 0; x < dimensions.width; x += gap) {
      for (let y = 0; y < dimensions.height; y += gap) {
        const isInMapShape =
          ((x < dimensions.width * 0.25 && x > dimensions.width * 0.05) &&
            (y < dimensions.height * 0.4 && y > dimensions.height * 0.1)) ||
          ((x < dimensions.width * 0.25 && x > dimensions.width * 0.15) &&
            (y < dimensions.height * 0.8 && y > dimensions.height * 0.4)) ||
          ((x < dimensions.width * 0.45 && x > dimensions.width * 0.3) &&
            (y < dimensions.height * 0.35 && y > dimensions.height * 0.15)) ||
          ((x < dimensions.width * 0.5 && x > dimensions.width * 0.35) &&
            (y < dimensions.height * 0.65 && y > dimensions.height * 0.35)) ||
          ((x < dimensions.width * 0.7 && x > dimensions.width * 0.45) &&
            (y < dimensions.height * 0.5 && y > dimensions.height * 0.1)) ||
          ((x < dimensions.width * 0.8 && x > dimensions.width * 0.65) &&
            (y < dimensions.height * 0.8 && y > dimensions.height * 0.6))

        const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453)
        const noise = seed - Math.floor(seed)

        if (isInMapShape && noise > 0.3) {
          result.push({
            x,
            y,
            radius: dotRadius,
            opacity: noise * 0.5 + 0.2,
          })
        }
      }
    }

    return result
  }, [dimensions.height, dimensions.width])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    const drawDots = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      dots.forEach((dot) => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = dark
          ? `rgba(148, 163, 184, ${dot.opacity * 0.62})`
          : `rgba(100, 116, 139, ${dot.opacity * 0.46})`
        ctx.fill()
      })
    }

    const drawRoutes = () => {
      routes.forEach((route) => {
        ctx.beginPath()
        ctx.moveTo(route.start.x, route.start.y)
        ctx.lineTo(route.end.x, route.end.y)
        ctx.strokeStyle = route.color
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 7])
        ctx.stroke()
        ctx.setLineDash([])

        ctx.beginPath()
        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = route.color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = dark ? "rgba(191, 219, 254, 0.72)" : "rgba(148, 163, 184, 0.7)"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(route.end.x, route.end.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = dark ? "rgba(148, 163, 184, 0.14)" : "rgba(148, 163, 184, 0.12)"
        ctx.fill()
      })
    }

    drawDots()
    drawRoutes()
  }, [dark, dimensions, dots, routes])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

export const TravelConnectSignIn = ({
  error,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onGuestLogin,
}: TravelSigninProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-xl backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-950/90"
      >
        <div className="relative hidden h-[600px] w-1/2 overflow-hidden border-r border-gray-100 dark:border-slate-800 md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5f9ff] via-[#e9f1ff] to-[#dce9ff] backdrop-blur-[2px] dark:from-[#06101f] dark:via-[#11214a] dark:to-[#19356d]">
            <motion.div
              aria-hidden="true"
              className="absolute left-[10%] top-[9%] size-44 rounded-full bg-blue-400/24 blur-3xl dark:bg-blue-500/22"
              animate={{
                x: [0, 24, -12, 0],
                y: [0, -18, 10, 0],
                scale: [1, 1.1, 0.96, 1],
                opacity: [0.72, 0.98, 0.78, 0.72],
              }}
              transition={{
                duration: 13,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-[7%] right-[10%] size-52 rounded-full bg-cyan-300/22 blur-3xl dark:bg-indigo-500/22"
              animate={{
                x: [0, -26, 14, 0],
                y: [0, 18, -14, 0],
                scale: [1, 0.94, 1.08, 1],
                opacity: [0.68, 0.9, 0.76, 0.68],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.66),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.26),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.24),transparent_36%)]" />
            <DotMap dark={isDark} />

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative mb-6"
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-18px] rounded-[34px] bg-primary/10 blur-2xl"
                  animate={{
                    scale: [0.94, 1.12, 0.96, 0.94],
                    opacity: [0.22, 0.56, 0.26, 0.22],
                  }}
                  transition={{
                    scale: {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-8px] rounded-[30px] border border-white/35 bg-white/16 blur-md dark:border-white/8 dark:bg-white/[0.03]"
                  animate={{
                    opacity: [0.14, 0.34, 0.14],
                    scale: [0.98, 1.06, 0.98],
                  }}
                  transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative flex size-24 items-center justify-center rounded-[28px] border border-white/70 bg-white/78 shadow-xl shadow-black/8 backdrop-blur dark:border-white/10 dark:bg-slate-950/74 dark:shadow-black/28"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -2, 0, 2, 0],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.img
                    src="logo.svg"
                    alt=""
                    className="size-14"
                    animate={{
                      scale: [1, 1.06, 1],
                    }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mb-2 text-center text-3xl font-semibold tracking-[-0.05em] text-foreground"
              >
                Free Mail
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="max-w-xs text-center text-sm leading-6 text-muted-foreground"
              >
                Sign in to access your domain email dashboard and connect with everywhere
              </motion.p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center bg-white p-8 dark:bg-slate-950 md:w-1/2 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-800 dark:text-slate-100 md:text-3xl">
                  Welcome back
                </h1>
                <p className="text-gray-500 dark:text-slate-400">
                  Sign in to your account
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {resolvedTheme === "dark" ? (
                  <SunMedium size={14} />
                ) : (
                  <MoonStar size={14} />
                )}
                {resolvedTheme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200"
                >
                  Email <span className="text-blue-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={username}
                  onChange={(event) => onUsernameChange(event.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full border-gray-200 bg-gray-50 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200"
                >
                  Password <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full border-gray-200 bg-gray-50 pr-10 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {error}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className={cn(
                    "relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2 text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-700",
                    isHovered ? "shadow-lg shadow-blue-200 dark:shadow-blue-950/40" : "",
                  )}
                  onClick={(event) => {
                    event.preventDefault()
                    onSubmit()
                  }}
                >
                  <span className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                  {isHovered ? (
                    <motion.span
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: "blur(8px)" }}
                    />
                  ) : null}
                </Button>
              </motion.div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-slate-950 dark:text-slate-400">
                    or
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <button
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={onGuestLogin}
                  type="button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <User className="h-5 w-5" />
                    <span>访客模式登录</span>
                  </span>
                </button>
              </div>
              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default TravelConnectSignIn
