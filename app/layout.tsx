<<<<<<< HEAD
<<<<<<< HEAD
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photo Pad',
  description: 'Photo Album Organizer',
=======
=======
>>>>>>> 99c6630 (feat: add and pin runtime dependencies (idb, dnd-kit, exifr, react-virtual))
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Album Organizer",
  description: "Organize your photos into albums",
<<<<<<< HEAD
>>>>>>> 99c6630 (feat: add and pin runtime dependencies (idb, dnd-kit, exifr, react-virtual))
=======
>>>>>>> 99c6630 (feat: add and pin runtime dependencies (idb, dnd-kit, exifr, react-virtual))
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
