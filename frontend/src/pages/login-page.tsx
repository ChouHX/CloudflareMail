import { useState } from "react"

import BackgroundShader from "@/components/ui/background-shader"
import TravelConnectSignIn from "@/components/ui/email-connect-signin-1"
import { useAppState, type SessionUser } from "@/lib/app-state"
import { login } from "@/lib/api"
import { navigate } from "@/lib/navigation"

export function LoginPage() {
  const { setSession } = useAppState()
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      const result = await login(username.trim(), password.trim())
      if (!result.authenticated && !result.role) {
        setError("登录失败，请检查账号密码。")
        return
      }

      const session: SessionUser = {
        username: result.username ?? username.trim(),
        role:
          result.role === "admin" ||
          result.role === "guest" ||
          result.role === "mailbox"
            ? result.role
            : "user",
        canSend: Boolean(result.can_send),
        mailboxLimit: result.mailbox_limit,
      }

      setError("")
      setSession(session)
      navigate("/app")
    } catch {
      setError("账号或密码错误，或服务端暂时不可用。")
    }
  }

  const handleGuestLogin = async () => {
    setUsername("guest")
    setPassword("admin")
    try {
      const result = await login("guest", "admin")
      setError("")
      setSession({
        username: result.username ?? "guest",
        role: result.role === "guest" ? "guest" : "guest",
        canSend: Boolean(result.can_send),
        mailboxLimit: result.mailbox_limit,
      })
      navigate("/app")
    } catch {
      setError("访客模式登录失败，请检查服务端 GUEST_PASSWORD 配置。")
    }
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300">
      <BackgroundShader />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <TravelConnectSignIn
          error={error}
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onGuestLogin={handleGuestLogin}
        />
      </div>
    </main>
  )
}
