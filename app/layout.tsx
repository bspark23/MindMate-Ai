import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { AudioPlayer } from "@/components/audio-player"; // Import AudioPlayer
import { FloatingRelaxationButton } from "@/components/floating-relaxation-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindMate - Your Mental Health Companion",
  description: "Your personal mental health journal with AI support, mood tracking, and wellness tools.",
  manifest: "/manifest.json",
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 md:py-12 pb-20 md:pb-8">
            {children}
          </main>
          <Footer />
          <FloatingRelaxationButton />
          <Toaster />
          <AudioPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
