import type { Metadata } from "next"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type React from "react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Axis.soft - Software Development Solutions",
  description:
    "Soluciones de desarrollo de software empresarial. Creamos aplicaciones web y moviles escalables con las ultimas tecnologias.",
  keywords: [
    "desarrollo software",
    "aplicaciones web",
    "desarrollo movil",
    "React",
    "Next.js",
    "Node.js",
    "soluciones empresariales",
  ],
  authors: [{ name: "Axis.soft" }],
  openGraph: {
    title: "Axis.soft - Software Development Solutions",
    description: "Soluciones de desarrollo de software empresarial con tecnologias modernas",
    type: "website",
    locale: "es_ES",
    siteName: "Axis.soft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axis.soft - Software Development Solutions",
    description: "Soluciones de desarrollo de software empresarial",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
