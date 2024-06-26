import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FooterMenu from "@/components/Footer";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="container min-h-full">

            <div className="mx-auto 
                  2xl:mx-w-screen-xl
                  2xl:px-3
                  xl:max-w-screen-lg
                  lg:max-w-screen-md
                  lg:px-2
                  md:max-w-screen-sm
                  md:px-1"
            >
              <main className="flex min-h-screen flex-col items-center justify-between p-24">
                {children}
              </main>

              <FooterMenu />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}