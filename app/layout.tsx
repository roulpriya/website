import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "priyaroul.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "Priyambada Roul — Software Engineer",
    description: "Software engineer, open-source contributor, and builder based in Bangalore.",
    openGraph: {
      title: "Priya Roul",
      description: "Software engineer, open-source contributor, and builder based in Bangalore.",
      type: "website",
      images: [{ url: image, width: 2400, height: 1260, alt: "Priya Roul — software engineer and open-source builder" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Priya Roul",
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {/* Applies the stored theme before the page paints, so navigating
            between routes never flashes the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
