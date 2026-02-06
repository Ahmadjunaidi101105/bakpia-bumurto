import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import fonts
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bakpia Bumurto - Green Kampoeng",
  description: "Kelembutan Bakpia Asli, Rasa yang Bikin Happy. Oleh-oleh khas dengan bahan premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
