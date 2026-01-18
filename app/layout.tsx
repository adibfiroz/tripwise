import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { ToasterProvider } from "@/components/toaster-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "TripWise",
  description: "Expense tracker for group trips made easy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
