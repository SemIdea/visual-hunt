import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/header";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/footer";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify weights as needed
});

export const metadata: Metadata = {
  title: "VisualHunt - Find the Source of Any Image or Video",
  description:
    "Advanced multi-engine reverse image and video search. Find what Google can't, from anime scenes to obscure memes and video clips.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Header />
          <div className="h-24" aria-hidden="true" />
          <main className="relative flex-1">{children}</main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
