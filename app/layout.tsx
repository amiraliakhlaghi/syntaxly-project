import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "next-themes";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SocketContextProvider } from "@/context/SocketContext";
import NextTopLoader from "nextjs-toploader";
import ToastProvider from "@/components/layout/ToastProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Syntaxly",
  description: "Write, share, and discover developer stories.",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth();

  return (
    <EdgeStoreProvider>
      <SessionProvider session={session}>
        <SocketContextProvider>
          <html
            lang="en"
            suppressHydrationWarning
            className={cn("font-sans", geist.variable)}
          >
            <body
              className={cn(
                "antialiased flex flex-col min-h-screen px-2 dark:bg-slate-950",
                poppins.variable,
              )}
            >
              <NextTopLoader
                color="#3b82f6"
                height={4}
                showSpinner={false}
                shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
                initialPosition={0.08}
                crawlSpeed={200}
                easing="ease"
                speed={200}
                zIndex={1600}
                showAtBottom={false}
              />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ToastProvider />
                <Navbar />
                <main className="grow">{children}</main>
                {modal}
              </ThemeProvider>
            </body>
          </html>
        </SocketContextProvider>
      </SessionProvider>
    </EdgeStoreProvider>
  );
}
