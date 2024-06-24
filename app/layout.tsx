import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { CollapseProvider } from "@/components/Providers/CollapseProvider";
import { SessionProvider } from "next-auth/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/Modals/ModalProvider";
import { auth } from "@/auth";

const font = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kboards",
  description: "A kanban board app with drag and drop functionality",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider session={session}>
            <CollapseProvider>{children}</CollapseProvider>
            <SpeedInsights />
            <Toaster />
            <ModalProvider />
          </SessionProvider>
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
