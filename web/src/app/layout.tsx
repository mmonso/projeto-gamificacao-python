import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ variable: "--fonte-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--fonte-jetbrains", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "Sibi", template: "%s · Sibi" },
  description: "Aprenda Python do zero, com lições de 5 minutos por dia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${jetbrains.variable} antialiased`}>
      <body>
        <a className="pular" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
