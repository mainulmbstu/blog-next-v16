import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/lib/components/navbar";
import Offline from "@/lib/components/Offline";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/components/context";
import Footer from "@/lib/components/Footer";
import NavMenu from "@/lib/components/NavMenu";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Blog-NextJS-v16",
    template: "%s | Blog-v16",
    // absolute:""
  },
  description: "A blog website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://res.cloudinary.com/dgj1icpu7/image/upload/v1731421057/ks1yrpyy3iy2rzpp2m4c.jpg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <AuthProvider>
        <body
          suppressHydrationWarning={true}
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
        >
          <ThemeProvider defaultTheme="system">
            <Toaster
              position="top-right"
              toastOptions={{
                className: "",
                duration: 5000,
                style: {
                  minWidth: "100px",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "green",
                    minWidth: "100px",
                  },
                },
                error: {
                  style: {
                    background: "#df5d5d",
                    minWidth: "100px",
                  },
                },
              }}
            />
            {/* <Navbar /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <NavMenu />
            </Suspense>
            <Offline />
            <div className="pt-16  flex  flex-col min-h-[100vh]">
              <div>{children}</div>
              <div className=" mt-auto">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
