import type React from "react"
import type { Metadata } from "next"
import "./global.css"

export const metadata: Metadata = {
  title: "Next.js Frontend Project",
  description: "A Next.js 15 frontend project with TypeScript and TailwindCSS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
