import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Hunter",
  description:
    "Automated lead generation for freelancers and consultants — powered by n8n + AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
