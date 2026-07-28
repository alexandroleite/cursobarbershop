import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/app/_lib/utils"
import { Toaster } from "./_components/ui/sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

// Usando a fonte Inter padrão do Shadcn UI
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "FSW Barber",
  description: "Gerencie seus agendamentos na barbearia",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
        )}
      >
        <AuthProvider>
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  )
}
