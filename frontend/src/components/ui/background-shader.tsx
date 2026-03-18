"use client"

import { motion } from "framer-motion"

export default function BackgroundShader() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background transition-colors duration-300">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-95 transition-opacity duration-300"
        style={{ backgroundImage: "var(--login-bg-image)" }}
        animate={{
          x: [0, -20, 14, 0],
          y: [0, 12, -10, 0],
          scale: [1, 1.04, 1.01, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(147,197,253,0.14),transparent_42%)]"
        animate={{
          opacity: [0.65, 0.9, 0.65],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundImage: "var(--login-bg-overlay)" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[-12%] top-[-16%] h-[28rem] w-[28rem] rounded-full blur-3xl transition-colors duration-300"
        style={{ background: "var(--login-bg-orb-1)" }}
        animate={{
          x: [0, 34, -18, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.14, 0.94, 1],
          opacity: [0.7, 1, 0.78, 0.7],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-18%] right-[-12%] h-[30rem] w-[30rem] rounded-full blur-3xl transition-colors duration-300"
        style={{ background: "var(--login-bg-orb-2)" }}
        animate={{
          x: [0, -30, 16, 0],
          y: [0, 22, -12, 0],
          scale: [1, 0.92, 1.1, 1],
          opacity: [0.72, 0.94, 0.82, 0.72],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[14%] h-56 w-56 -translate-x-1/2 rounded-full bg-white/14 blur-3xl dark:bg-sky-300/10"
        animate={{
          y: [0, -12, 8, 0],
          scale: [0.94, 1.08, 0.98, 0.94],
          opacity: [0.18, 0.34, 0.22, 0.18],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
