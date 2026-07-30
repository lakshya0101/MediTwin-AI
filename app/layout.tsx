import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const instrumentSerif = localFont({
  src: "./fonts/InstrumentSerif-Regular.ttf",
  variable: "--font-display",
  display: "swap",
});

const satoshi = localFont({
  src: "./fonts/satoshi/Satoshi-Regular.otf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediTwin AI | Simulate Tomorrow's Health",
  description: "Simulate Tomorrow's Health Before It Becomes Today's Problem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${satoshi.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground min-h-screen relative font-sans transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {/* Depth Layer 1: Background & Ambience */}
          <div className="bg-mesh"></div>
          
          {/* Content Layer */}
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
