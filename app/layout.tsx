import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { CollapseProvider } from "@/components/Providers/CollapseProvider";
import ClerkCustomProvider from "@/components/Providers/ClerkCustomProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/Modals/ModalProvider";

const font = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kboards",
  description: "A kanban board app with drag and drop functionality",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkCustomProvider>
            <CollapseProvider>{children}</CollapseProvider>
            <SpeedInsights />
            <Toaster />
            <ModalProvider />
          </ClerkCustomProvider>
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
