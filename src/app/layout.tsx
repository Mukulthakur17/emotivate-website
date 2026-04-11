import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Emotivate | Online Counselling",
  description:
    "Therapy that feels human. Growth that feels possible. Professional psychotherapy by Sukhmani Walia — licensed RCI counselling psychologist with 3,000+ hours of practice.",
  keywords: [
    "therapy",
    "counselling",
    "psychologist",
    "mental health",
    "online therapy",
    "Emotivate",
    "Sukhmani Walia",
    "anxiety",
    "depression",
    "couples therapy",
  ],
  openGraph: {
    title: "Emotivate | Online Counselling",
    description:
      "Therapy that feels human. Growth that feels possible.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-navy-900 text-offwhite font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
