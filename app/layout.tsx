import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jihoon Choi",
  description: "Personal website of Jihoon Choi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
