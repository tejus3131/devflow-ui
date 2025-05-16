import type { Metadata } from "next";
import "./styles/globals.css";
import { UserProvider } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";
import { Satisfy, Nunito, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { ModalProvider } from "@/context/ModalContext";

const inter = Satisfy({
  variable: "--font-handwriting",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const sans = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "A collaborative platform for developers"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body>
        <UserProvider>
          <div className="min-h-screen flex bg-background-light dark:bg-background-dark  text-black dark:text-white ">
            <ModalProvider>
              <ThemeProvider>
                <Sidebar />
                <main
                  className="flex-grow transition-all duration-300"
                  style={{ marginLeft: "4rem" }}
                  id="main-content"
                >
                  {children}
                </main>
              </ThemeProvider>
            </ModalProvider>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
