import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ScrollManager from "@/components/ScrollManager";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_CLINIC_NAME ?? "Klinik",
  description: "Online randevu ve klinik bilgi sistemi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="tr" className="h-full antialiased">
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script dangerouslySetInnerHTML={{ __html: 'history.scrollRestoration="manual";' }} />
        </head>
        <body className={`${inter.className} min-h-full flex flex-col`}>
          <ScrollManager />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
