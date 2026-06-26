import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Album Organizer",
  description: "Organize your photos into albums",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
