import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siyam AI",
  description: "Professional Image Generation by Siyam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
