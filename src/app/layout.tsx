import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakura Music Player",
  description:
    "An immersive music player inspired by '5 Centimeters per Second', featuring animated petals and a customizable playlist.",
  keywords:
    "music player, sakura, petals, audio, customizable playlist, drag and drop, loop, shuffle, Next.js",
  authors: [{ name: "Vergil1000", url: "https://github.com/Vergil1000x" }],
  creator: "Vergil1000",
  metadataBase: new URL("https://yourwebsite.com"), // Replace with your actual website URL
  openGraph: {
    title: "Sakura Music Player",
    description:
      "Experience music like never before with our petal-themed player.",
    url: "https://yourwebsite.com", // Replace with your website URL
    siteName: "Sakura",
    images: [
      {
        url: "/5cpc.jpg", // Path to your main image
        width: 1200,
        height: 630,
        alt: "Sakura Music Player",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakura Music Player",
    description:
      "An immersive music player inspired by '5 Centimeters per Second'.",
    images: [
      {
        url: "/5cpc.jpg", // Path to your main image
        width: 1200,
        height: 630,
        alt: "Sakura Music Player",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased overflow-x-hidden relative w-screen min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
