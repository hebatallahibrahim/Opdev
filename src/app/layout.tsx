import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Quicksand } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import "./globals.css";

// Brand headings are set in Gordita (licensed, not yet supplied); Plus Jakarta Sans
// stands in as the closest geometric match until the font files are provided.
const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

// Brand secondary typeface, per the guideline.
const accent = Quicksand({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OP Dev. — Building Capabilities. Enabling Growth.",
  description:
    "OP DEV partners with businesses and organizations to strengthen their foundations, deliver integrated solutions, develop digital systems, and unlock opportunities for sustainable growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${accent.variable} grain antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
