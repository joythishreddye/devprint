import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
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
          <ErrorBoundary>
            <Header />
            {children}
          </ErrorBoundary>
        </body>
    </html>
  );
}
