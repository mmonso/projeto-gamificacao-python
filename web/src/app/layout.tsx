import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { AvisoConexao } from "@/componentes/AvisoConexao";
import "./globals.css";

const nunito = Nunito({ variable: "--fonte-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--fonte-jetbrains", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "Sibi: Python em 5 minutos por dia", template: "%s · Sibi" },
  description: "A academia diária de Python, em português. Lições de 5 minutos para ler, prever e corrigir código, do zero.",
  applicationName: "Sibi",
  openGraph: { siteName: "Sibi", locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${jetbrains.variable} antialiased`}>
      <body>
        <a className="pular" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        <AvisoConexao />
        {children}
      </body>
    </html>
  );
}
