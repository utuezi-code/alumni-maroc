import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "COMAL — La communauté des anciens du Maroc à Abidjan",
  description:
    "Une communauté vivante d'anciens étudiants formés au Maroc, aujourd'hui actifs à Abidjan. Rejoignez l'annuaire, les rencontres et les opportunités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
