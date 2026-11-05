import type { Metadata } from "next";
import { Introducao } from "./Introducao";

export const metadata: Metadata = { title: "Introdução" };

export default function PaginaIntroducao() {
  return <Introducao />;
}
