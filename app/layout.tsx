import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Maps Business Data Extractor",
  description: "Extract business data from Google Maps and export to Excel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
