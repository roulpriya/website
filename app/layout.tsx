import type { Metadata } from "next";
import { headers } from "next/headers";
import { IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "priyaroul.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "Priyambada Roul — Software Engineer",
    description: "Software engineer, open-source contributor, and builder based in Bangalore.",
    openGraph: {
      title: "Priyambada Roul — Software Engineer",
      description: "Software engineer, open-source contributor, and builder based in Bangalore.",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Priyambada Roul — software engineer and open-source builder" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Priyambada Roul — Software Engineer",
      description: "Software engineer, open-source contributor, and builder based in Bangalore.",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${plexMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
