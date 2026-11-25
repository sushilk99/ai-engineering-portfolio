import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sushil Kumar Prajapati | AI & Software Engineering",
  description:
    "Sushil Kumar Prajapati builds AI applications and full-stack software with a verification and validation mindset.",
  openGraph: {
    title: "Sushil Kumar Prajapati | AI & Software Engineering",
    description:
      "AI applications, full-stack software, and quality-minded engineering by Sushil Kumar Prajapati.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f5f0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
