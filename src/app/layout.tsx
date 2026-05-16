import Navbar from "@/components/Navbar";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "NextBlog - AI Powered",
  description: "A modern Next.js blog with AI summaries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased flex flex-col min-h-screen selection:bg-primary/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-28 pb-12 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
