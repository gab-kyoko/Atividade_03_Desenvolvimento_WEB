// Layout = raiz, envolve todas as páginas do sistema
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrelinhas",
  description: "Adaptações de aula com apoio de IA, com a decisão sempre do professor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
