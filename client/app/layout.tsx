import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/providers/ContextProvider";
import { ThemeProvider } from "@/context/themeProvider";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Prashikshan | Find Your Dream Job",
  description: "Advanced Job Portal for Students and Professionals",
  icons: {
    icon: [
      { url: "/favicon.ico" }, // Default
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }, // For iPhones
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />
      </head>
      <body className={`${roboto.className} antialiased`}>
        {/* 1. Theme Provider handles Light/Dark mode */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* 2. ContextProvider must WRAP the children to provide Job/Global state */}
          <ContextProvider>
            {children}
            <Toaster position="top-center" />
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}