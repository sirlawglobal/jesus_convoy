import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jesus Convoy Church",
    template: "%s | Jesus Convoy",
  },
  description:
    "Advancing God's Kingdom Together. Join Jesus Convoy for transformative worship, spirit-filled sermons, and vibrant community.",
  keywords: ["church", "Jesus Convoy", "worship", "sermons", "ministry"],
  openGraph: {
    siteName: "Jesus Convoy",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e3a8a",
              color: "#fff",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "0.75rem",
            },
            success: {
              iconTheme: { primary: "#f59e0b", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
