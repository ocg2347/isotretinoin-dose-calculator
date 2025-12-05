import type { Metadata } from "next";
import Script from "next/script";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import InfoDialog from "@/components/info-dialog";
import ThemePicker from "@/components/theme-picker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isotretinoin Dose Calculator",
  description: "Simple Calculator for Isotretinoin Treatment. Developed by Muhammet Hatipoglu github/ocg2347",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-4 z-50">
            <ThemePicker />
          </div>
          <div className="fixed top-4 left-4 z-50">
            <InfoDialog />
          </div>
          {children}
          {/* GA tag */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-CLV0RQE5JR"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CLV0RQE5JR');
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
