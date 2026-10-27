import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Continent Links | Phone Screens & Touch Pads",
  description: "Discover phone screens and touch pads for iPhone, Samsung, Infinix, Tecno and more at Continent Links.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
