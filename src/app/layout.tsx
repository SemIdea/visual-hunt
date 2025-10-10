import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/header";
import { getServerSession } from "next-auth";
import "./globals.css";
import "react-image-crop/dist/ReactCrop.css";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { ReactNode } from "react";
import Footer from "@/components/footer";

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
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers
          session={session}
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Header />
          {/* Spacer to account for fixed header height (h-24 ~= 6rem) */}
          <div className="h-24" aria-hidden="true" />
          <main className="relative flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
