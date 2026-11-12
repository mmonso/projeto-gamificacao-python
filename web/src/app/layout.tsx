import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { AvisoConexao } from "@/componentes/AvisoConexao";
import { RegistrarApp } from "@/componentes/RegistrarApp";
import { COR_DA_BARRA, SCRIPT_TEMA } from "@/modulos/aparencia/tema";
import "./globals.css";

const nunito = Nunito({ variable: "--fonte-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--fonte-jetbrains", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "Sibi: Python em 5 minutos por dia", template: "%s · Sibi" },
  description: "A academia diária de Python, em português. Lições de 5 minutos para ler, prever e corrigir código, do zero.",
  applicationName: "Sibi",
  openGraph: { siteName: "Sibi", locale: "pt_BR", type: "website" },
  // Instalado na tela de início do iPhone, abre sem a barra do Safari.
  appleWebApp: { capable: true, title: "Sibi", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: COR_DA_BARRA.escuro, colorScheme: "dark light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // O script do tema muda data-tema antes da hidratação: a diferença no <html> é esperada.
    <html lang="pt-BR" className={`${nunito.variable} ${jetbrains.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <a className="pular" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        <AvisoConexao />
        <RegistrarApp />
        {children}
      </body>
    </html>
  );
}
