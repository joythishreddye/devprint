import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevPrint — Tech Stack Planning for Developers",
  description:
    "Compare technologies side by side, explore scoring across performance and ecosystem dimensions, and generate AI tool configs for Claude Code, GitHub Copilot, and Gemini CLI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to main content
          </a>
          <ToastProvider>
            <ErrorBoundary>
              <Header />
              <main id="main-content" className="flex flex-1 flex-col">
                {children}
              </main>
              <Footer />
            </ErrorBoundary>
          </ToastProvider>
        </body>
    </html>
  );
}
