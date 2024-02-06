import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import ScrollButtons from "@/components/ScrollButtons";

const font = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ranking List",
  description: "Drag and Drop Sorting List",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ScrollButtons />
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
