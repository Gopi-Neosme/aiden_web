import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import FluentRoot from './_theme/FluentRoot';
import ThemeRegistry from './_theme/ThemeRegistry';

export const metadata: Metadata = {
  title: "Aiden Dashboard",
  description: "Microsoft-inspired customizable dashboard with widgets",
  keywords: ["dashboard", "widgets", "analytics", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ThemeRegistry>
          <FluentRoot initialMode="light" dir="ltr">
            <div className="app-layout">
              <Sidebar />
              <main className="app-content">
                {children}
              </main>
            </div>
          </FluentRoot>
        </ThemeRegistry>
      </body>
    </html>
  );
}