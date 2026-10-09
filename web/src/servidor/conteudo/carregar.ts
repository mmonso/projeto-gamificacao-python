// Leitura dos arquivos de conteúdo (conteudo/unidade-*/), validados com o esquema do app.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { licaoEsquema, type Licao } from "@/modulos/conteudo/esquema";

export const unidadeEsquema = z.object({
  id: z.string().regex(/^u\d+$/),
  versao: z.number().int().min(1),
  ordem: z.number().int().min(1),
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  conceitos: z.array(z.object({ id: z.string().min(1), nome: z.string().min(1), descricao: z.string().min(1) })).min(1),
});

export type Unidade = z.infer<typeof unidadeEsquema>;
export type Curso = { unidade: Unidade; licoes: Licao[] }[];

export function carregarCurso(pastaConteudo: string): Curso {
  return readdirSync(pastaConteudo)
    .filter((d) => /^unidade-\d+$/.test(d))
    .map((d) => {
      const pasta = join(pastaConteudo, d);
      const ler = (arquivo: string) => parse(readFileSync(join(pasta, arquivo), "utf8"));
      const unidade = unidadeEsquema.parse(ler("unidade.yaml"));
      const licoes = readdirSync(pasta)
        .filter((f) => /^licao-\d+\.yaml$/.test(f))
        .map((f) => licaoEsquema.parse(ler(f)))
        .sort((a, b) => a.ordem - b.ordem);
      return { unidade, licoes };
    })
    .sort((a, b) => a.unidade.ordem - b.unidade.ordem);
}
