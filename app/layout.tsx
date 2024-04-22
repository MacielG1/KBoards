import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { CollapseProvider } from "@/components/Providers/CollapseProvider";
import ClerkCustomProvider from "@/components/Providers/ClerkCustomProvider";

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
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkCustomProvider>
            <CollapseProvider>{children}</CollapseProvider>
          </ClerkCustomProvider>
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
