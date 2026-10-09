"""Valida o conteúdo de uma unidade e executa seus exemplos.

Uso:
    python ferramentas/verificar_conteudo.py conteudo/unidade-1 [--leitura]

Regras descritas em conteudo/FORMATO.md.
"""

import argparse
import builtins
import contextlib
import io
import itertools
import re
import sys
import textwrap
import traceback
from pathlib import Path

import yaml

TIPOS = {"escolher_resultado", "completar_lacuna", "ordenar_blocos", "localizar_erro"}
ERROS = {"SyntaxError", "IndentationError", "NameError", "TypeError", "saida_incorreta"}
ID_EXERCICIO = re.compile(r"^u\d+-l\d+-[er]\d{2}$")
ID_CONCEITO = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MARCADOR = re.compile(r"___(\d)___")
MAX_ENUNCIADO = 200
MAX_LINHAS_CODIGO = 10


class Execucao:
    def __init__(self, saida, erro=None, linha=None):
        self.saida = saida
        self.erro = erro
        self.linha = linha

    def __repr__(self):
        if self.erro:
            return f"{self.erro} na linha {self.linha}"
        return repr(self.saida)


def _input_bloqueado(*_):
    raise RuntimeError("input() não é permitido no verificador")


def executar(codigo):
    """Executa o código isolado e devolve saída, tipo de erro e linha do erro."""
    buffer = io.StringIO()
    try:
        compilado = compile(codigo, "<exercicio>", "exec")
    except SyntaxError as e:
        return Execucao("", type(e).__name__, e.lineno)
    ambiente = {"__name__": "__exercicio__", "__builtins__": {**vars(builtins), "input": _input_bloqueado}}
    try:
        with contextlib.redirect_stdout(buffer):
            exec(compilado, ambiente)
    except Exception as e:
        linhas = [q.lineno for q in traceback.extract_tb(e.__traceback__) if q.filename == "<exercicio>"]
        return Execucao(_normalizar(buffer.getvalue()), type(e).__name__, linhas[-1] if linhas else None)
    return Execucao(_normalizar(buffer.getvalue()))


def _normalizar(texto):
    return texto.rstrip("\n")


def _linhas(*partes):
    return "\n".join(p.rstrip("\n") for p in partes if p)


class Relatorio:
    def __init__(self):
        self.erros = []
        self.avisos = []

    def erro(self, onde, msg):
        if f"{onde}: {msg}" not in self.erros:
            self.erros.append(f"{onde}: {msg}")

    def aviso(self, onde, msg):
        self.avisos.append(f"{onde}: {msg}")


def _texto(rel, onde, valor, campo, obrigatorio=True):
    if valor is None:
        if obrigatorio:
            rel.erro(onde, f"campo '{campo}' ausente")
        return False
    if not isinstance(valor, str):
        rel.erro(onde, f"'{campo}' deve ser texto; use aspas ou bloco |- (recebido {type(valor).__name__}: {valor!r})")
        return False
    if not valor.strip():
        rel.erro(onde, f"'{campo}' está vazio")
        return False
    return True


def validar_comuns(rel, ex, conceitos_validos, ids_vistos, revisao):
    onde = ex.get("id", "<sem id>")
    if not isinstance(ex.get("id"), str) or not ID_EXERCICIO.match(ex["id"]):
        rel.erro(onde, "id ausente ou fora do formato u1-l1-e01 / u1-l1-r01")
    elif ex["id"] in ids_vistos:
        rel.erro(onde, "id repetido")
    else:
        ids_vistos.add(ex["id"])
        esperado = "-r" if revisao else "-e"
        if esperado not in ex["id"]:
            rel.erro(onde, f"id de exercício {'de revisão' if revisao else 'principal'} deve conter '{esperado}'")
    if not isinstance(ex.get("versao"), int) or ex["versao"] < 1:
        rel.erro(onde, "versao deve ser inteiro maior ou igual a 1")
    if ex.get("tipo") not in TIPOS:
        rel.erro(onde, f"tipo inválido: {ex.get('tipo')!r}")
    _texto(rel, onde, ex.get("objetivo"), "objetivo")
    if _texto(rel, onde, ex.get("enunciado"), "enunciado") and len(ex["enunciado"]) > MAX_ENUNCIADO:
        rel.erro(onde, f"enunciado com {len(ex['enunciado'])} caracteres; máximo {MAX_ENUNCIADO}")
    _texto(rel, onde, ex.get("explicacao"), "explicacao")
    if ex.get("dificuldade") not in (1, 2, 3):
        rel.erro(onde, "dificuldade deve ser 1, 2 ou 3")
    conceitos = ex.get("conceitos")
    if not isinstance(conceitos, list) or not conceitos:
        rel.erro(onde, "conceitos deve ser uma lista não vazia")
    else:
        for c in conceitos:
            if c not in conceitos_validos:
                rel.erro(onde, f"conceito desconhecido: {c!r}")
    dicas = ex.get("dicas")
    if not isinstance(dicas, list) or not 1 <= len(dicas) <= 3:
        rel.erro(onde, "dicas deve ter de uma a três entradas")
    else:
        for i, d in enumerate(dicas, 1):
            _texto(rel, onde, d, f"dicas[{i}]")
    if "codigo" in ex and _texto(rel, onde, ex["codigo"], "codigo"):
        n = len(ex["codigo"].rstrip("\n").split("\n"))
        if n > MAX_LINHAS_CODIGO:
            rel.erro(onde, f"código com {n} linhas; máximo {MAX_LINHAS_CODIGO}")
    if "saida_esperada" in ex:
        _texto(rel, onde, ex["saida_esperada"], "saida_esperada")


def verificar_escolher(rel, ex):
    onde = ex["id"]
    opcoes = ex.get("opcoes")
    if not isinstance(opcoes, list) or not 3 <= len(opcoes) <= 4:
        rel.erro(onde, "escolher_resultado precisa de três ou quatro opções")
        return
    ids = [o.get("id") for o in opcoes]
    if len(set(ids)) != len(ids):
        rel.erro(onde, "ids de opção repetidos")
    if ex.get("resposta") not in ids:
        rel.erro(onde, f"resposta {ex.get('resposta')!r} não é uma opção")
        return
    for o in opcoes:
        if not o.get("erro"):
            _texto(rel, f"{onde}/{o.get('id')}", o.get("texto"), "texto")
        if "feedback" in o:
            _texto(rel, f"{onde}/{o.get('id')}", o["feedback"], "feedback")
    textos = [_normalizar(o["texto"]) for o in opcoes if isinstance(o.get("texto"), str) and not o.get("erro")]
    if len(set(textos)) != len(textos):
        rel.erro(onde, "duas opções têm o mesmo texto")

    modo = ex.get("opcoes_sao")
    if modo == "saida":
        if not _texto(rel, onde, ex.get("codigo"), "codigo"):
            return
        r = executar(ex["codigo"])
        for o in opcoes:
            corresponde = bool(r.erro) if o.get("erro") else (not r.erro and _normalizar(o.get("texto", "")) == r.saida)
            correta = o["id"] == ex["resposta"]
            if correta and not corresponde:
                rel.erro(onde, f"opção correta {o['id']!r} não corresponde à execução: {r!r}")
            if not correta and corresponde:
                rel.erro(onde, f"distrator {o['id']!r} corresponde à execução: {r!r}")
    elif modo == "codigo":
        if not _texto(rel, onde, ex.get("saida_esperada"), "saida_esperada"):
            return
        alvo = _normalizar(ex["saida_esperada"])
        for o in opcoes:
            r = executar(o.get("texto", ""))
            produz = not r.erro and r.saida == alvo
            if o["id"] == ex["resposta"] and not produz:
                rel.erro(onde, f"opção correta {o['id']!r} não produz a saída esperada: {r!r}")
            if o["id"] != ex["resposta"] and produz:
                rel.erro(onde, f"distrator {o['id']!r} também produz a saída esperada")
    elif modo == "texto":
        if not ex.get("revisao_manual"):
            rel.erro(onde, "opções de texto exigem 'revisao_manual'")
        else:
            rel.aviso(onde, "opções de texto: verificação manual")
    else:
        rel.erro(onde, f"opcoes_sao inválido: {modo!r}")


def verificar_lacuna(rel, ex):
    onde = ex["id"]
    if not _texto(rel, onde, ex.get("codigo"), "codigo") or not _texto(rel, onde, ex.get("saida_esperada"), "saida_esperada"):
        return
    lacunas = ex.get("lacunas")
    if not isinstance(lacunas, list) or not 1 <= len(lacunas) <= 3:
        rel.erro(onde, "completar_lacuna precisa de uma a três lacunas")
        return
    marcadores = MARCADOR.findall(ex["codigo"])
    ids = [str(lc.get("id")) for lc in lacunas]
    if sorted(marcadores) != sorted(ids):
        rel.erro(onde, f"marcadores no código {marcadores} não correspondem às lacunas {ids}")
        return
    for lc in lacunas:
        opcoes = lc.get("opcoes")
        if not isinstance(opcoes, list) or not 2 <= len(opcoes) <= 4:
            rel.erro(onde, f"lacuna {lc.get('id')}: precisa de duas a quatro opções")
            return
        for o in opcoes:
            if not _texto(rel, onde, o, f"lacuna {lc.get('id')} opção"):
                return
        if len(set(opcoes)) != len(opcoes):
            rel.erro(onde, f"lacuna {lc.get('id')}: opções repetidas")
        if lc.get("resposta") not in opcoes:
            rel.erro(onde, f"lacuna {lc.get('id')}: resposta {lc.get('resposta')!r} não está entre as opções")
            return
    alvo = _normalizar(ex["saida_esperada"])
    for combinacao in itertools.product(*[lc["opcoes"] for lc in lacunas]):
        codigo = ex["codigo"]
        for lc, escolha in zip(lacunas, combinacao):
            codigo = codigo.replace(f"___{lc['id']}___", escolha)
        r = executar(codigo)
        produz = not r.erro and r.saida == alvo
        correta = all(escolha == lc["resposta"] for lc, escolha in zip(lacunas, combinacao))
        if correta and not produz:
            rel.erro(onde, f"respostas corretas não produzem a saída esperada: {r!r}")
        if not correta and produz:
            rel.erro(onde, f"combinação incorreta também produz a saída esperada: {list(combinacao)}")


def verificar_blocos(rel, ex):
    onde = ex["id"]
    if not _texto(rel, onde, ex.get("saida_esperada"), "saida_esperada"):
        return
    blocos = ex.get("blocos")
    if not isinstance(blocos, list) or not 2 <= len(blocos) <= 7:
        rel.erro(onde, "ordenar_blocos precisa de dois a sete blocos")
        return
    por_id = {}
    for b in blocos:
        if not _texto(rel, f"{onde}/{b.get('id')}", b.get("codigo"), "codigo"):
            return
        if "\n" in b["codigo"].strip("\n"):
            rel.erro(onde, f"bloco {b.get('id')!r} tem mais de uma linha")
        por_id[b.get("id")] = b["codigo"].strip("\n")
    if len(por_id) != len(blocos):
        rel.erro(onde, "ids de bloco repetidos")
        return
    aceitas = ex.get("resposta")
    if not isinstance(aceitas, list) or not aceitas or not all(isinstance(a, list) for a in aceitas):
        rel.erro(onde, "resposta deve ser uma lista de ordens aceitas")
        return
    aceitas_t = set()
    for a in aceitas:
        if any(i not in por_id for i in a) or len(set(a)) != len(a):
            rel.erro(onde, f"ordem aceita inválida: {a}")
            return
        aceitas_t.add(tuple(a))
    antes = ex.get("codigo_antes", "")
    depois = ex.get("codigo_depois", "")
    for campo in ("codigo_antes", "codigo_depois"):
        if campo in ex:
            _texto(rel, onde, ex[campo], campo)
    alvo = _normalizar(ex["saida_esperada"])
    validas = set()
    ids = list(por_id)
    for k in range(1, len(ids) + 1):
        for seq in itertools.permutations(ids, k):
            r = executar(_linhas(antes, *[por_id[i] for i in seq], depois))
            if not r.erro and r.saida == alvo:
                validas.add(seq)
    for seq in sorted(validas - aceitas_t):
        rel.erro(onde, f"ordem que produz a saída esperada e não está aceita: {list(seq)}")
    for seq in sorted(aceitas_t - validas):
        rel.erro(onde, f"ordem aceita que não produz a saída esperada: {list(seq)}")
    usados = {i for seq in aceitas_t for i in seq}
    distratores = [i for i in ids if i not in usados]
    if not distratores:
        rel.aviso(onde, "sem blocos distratores")


def verificar_localizar(rel, ex):
    onde = ex["id"]
    if not _texto(rel, onde, ex.get("codigo"), "codigo") or not _texto(rel, onde, ex.get("correcao"), "correcao"):
        return
    linhas = ex["codigo"].rstrip("\n").split("\n")
    resposta = ex.get("resposta")
    if not isinstance(resposta, int) or not 1 <= resposta <= len(linhas):
        rel.erro(onde, f"resposta deve ser uma linha entre 1 e {len(linhas)}")
        return
    if len(linhas) < 2:
        rel.erro(onde, "localizar_erro precisa de pelo menos duas linhas")
    erro = ex.get("erro")
    if erro not in ERROS:
        rel.erro(onde, f"erro inválido: {erro!r}")
        return
    alvo = _normalizar(ex["saida_esperada"]) if isinstance(ex.get("saida_esperada"), str) else None
    r = executar(ex["codigo"])
    if erro == "saida_incorreta":
        if alvo is None:
            rel.erro(onde, "saida_incorreta exige saida_esperada")
            return
        if r.erro:
            rel.erro(onde, f"o programa deveria executar sem erro, mas gerou {r!r}")
        elif r.saida == alvo:
            rel.erro(onde, "o programa com erro já produz a saída esperada")
    else:
        if r.erro != erro:
            rel.erro(onde, f"esperado {erro}, obtido {r!r}")
        elif r.linha != resposta:
            rel.erro(onde, f"o Python aponta o erro na linha {r.linha}, não na linha {resposta}")
    if ex["correcao"].rstrip() == linhas[resposta - 1].rstrip():
        rel.erro(onde, "a correção é igual à linha original")
    corrigido = linhas[:]
    corrigido[resposta - 1] = ex["correcao"]
    rc = executar("\n".join(corrigido))
    if rc.erro:
        rel.erro(onde, f"o programa corrigido gera {rc!r}")
    elif alvo is not None and rc.saida != alvo:
        rel.erro(onde, f"o programa corrigido produz {rc!r}, esperado {alvo!r}")


VERIFICADORES = {
    "escolher_resultado": verificar_escolher,
    "completar_lacuna": verificar_lacuna,
    "ordenar_blocos": verificar_blocos,
    "localizar_erro": verificar_localizar,
}


def carregar(caminho):
    with open(caminho, encoding="utf-8") as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as e:
            marca = getattr(e, "problem_mark", None)
            onde = f"{caminho}, linha {marca.line + 1}, coluna {marca.column + 1}" if marca else str(caminho)
            sys.exit(f"ERRO   YAML inválido em {onde}: {getattr(e, 'problem', e)}. Textos com ': ' precisam de aspas.")


def verificar_unidade(pasta, rel):
    unidade = carregar(pasta / "unidade.yaml")
    conceitos = {}
    for c in unidade.get("conceitos", []):
        if not isinstance(c.get("id"), str) or not ID_CONCEITO.match(c["id"]):
            rel.erro("unidade", f"id de conceito inválido: {c.get('id')!r}")
            continue
        conceitos[c["id"]] = c
        _texto(rel, f"conceito {c['id']}", c.get("nome"), "nome")
        _texto(rel, f"conceito {c['id']}", c.get("descricao"), "descricao")
    licoes = []
    for arquivo in sorted(pasta.glob("licao-*.yaml")):
        licao = carregar(arquivo)
        licoes.append(licao)
        onde = licao.get("id", arquivo.name)
        if licao.get("unidade") != unidade.get("id"):
            rel.erro(onde, "lição aponta para outra unidade")
        for c in licao.get("conceitos", []):
            if c not in conceitos:
                rel.erro(onde, f"conceito desconhecido: {c!r}")
        principais = licao.get("exercicios") or []
        if not 5 <= len(principais) <= 8:
            rel.erro(onde, f"lição com {len(principais)} exercícios principais; esperado de 5 a 8")
    licoes.sort(key=lambda lc: lc.get("ordem", 0))
    if [lc.get("ordem") for lc in licoes] != list(range(1, len(licoes) + 1)):
        rel.erro("unidade", "ordem das lições deve ser 1, 2, 3…")

    ids_vistos = set()
    usados = set()
    for licao in licoes:
        principais = licao.get("exercicios") or []
        revisao = licao.get("revisao") or []
        ids_principais = {ex.get("id") for ex in principais}
        for grupo, eh_revisao in ((principais, False), (revisao, True)):
            for ex in grupo:
                validar_comuns(rel, ex, conceitos, ids_vistos, eh_revisao)
                if not str(ex.get("id", "")).startswith(licao.get("id", "") + "-"):
                    rel.erro(ex.get("id", "<sem id>"), "id não começa com o id da lição")
                if eh_revisao and ex.get("variacao_de") not in ids_principais:
                    rel.erro(ex.get("id", "<sem id>"), f"variacao_de {ex.get('variacao_de')!r} não é exercício principal da lição")
                usados.update(ex.get("conceitos") or [])
                if ex.get("tipo") in VERIFICADORES and isinstance(ex.get("id"), str):
                    VERIFICADORES[ex["tipo"]](rel, ex)
        tipos = {ex.get("tipo") for ex in principais}
        if len(tipos) < 3:
            rel.aviso(licao.get("id"), f"apenas {len(tipos)} tipos de exercício na sessão principal")
    for c in conceitos:
        if c not in usados:
            rel.aviso("unidade", f"conceito {c!r} não é avaliado por nenhum exercício")
    return unidade, licoes


def _bloco(texto, linguagem=""):
    return f"```{linguagem}\n{texto.rstrip()}\n```"


def gerar_leitura(pasta, unidade, licoes):
    nomes = {c["id"]: c["nome"] for c in unidade.get("conceitos", [])}
    p = [
        f"# Unidade {unidade['ordem']} — {unidade['titulo']}: versão de leitura",
        "",
        "Gerado por `ferramentas/verificar_conteudo.py` a partir dos arquivos YAML. Não edite à mão.",
        "",
    ]

    def exercicio(ex):
        nonlocal p
        p.append(f"#### {ex['id']} — {ex['tipo'].replace('_', ' ')} (dificuldade {ex['dificuldade']})")
        p.append("")
        if ex.get("variacao_de"):
            p.append(f"Variação de {ex['variacao_de']}.")
            p.append("")
        p.append(f"**Enunciado:** {ex['enunciado']}")
        p.append("")
        if ex.get("codigo_antes"):
            p += ["Linhas fixas antes:", "", _bloco(ex["codigo_antes"], "python"), ""]
        if ex.get("codigo"):
            codigo = ex["codigo"]
            if ex["tipo"] == "localizar_erro":
                codigo = "\n".join(f"{i:>2}  {linha}" for i, linha in enumerate(codigo.rstrip("\n").split("\n"), 1))
            p += [_bloco(codigo, "python"), ""]
        if ex.get("saida_esperada") and not (ex["tipo"] == "localizar_erro" and ex["erro"] != "saida_incorreta"):
            p += ["Saída esperada:", "", _bloco(ex["saida_esperada"], "text"), ""]
        if ex["tipo"] == "escolher_resultado":
            for o in ex["opcoes"]:
                marca = "✅" if o["id"] == ex["resposta"] else "▫️"
                texto = "O programa mostra um erro" if o.get("erro") else o["texto"]
                if not o.get("erro") and ex["opcoes_sao"] in ("saida", "codigo"):
                    linguagem = "python" if ex["opcoes_sao"] == "codigo" else "text"
                    p += [f"- {marca} {o['id']}:", "", textwrap.indent(_bloco(texto, linguagem), "  "), ""]
                else:
                    p.append(f"- {marca} {o['id']}: {texto}")
                if o.get("feedback"):
                    p.append(f"  - Feedback: {o['feedback']}")
            p.append("")
        elif ex["tipo"] == "completar_lacuna":
            for lc in ex["lacunas"]:
                opcoes = ", ".join(f"**`{o}`**" if o == lc["resposta"] else f"`{o}`" for o in lc["opcoes"])
                p.append(f"- Lacuna {lc['id']}: {opcoes}")
            p.append("")
        elif ex["tipo"] == "ordenar_blocos":
            usados = {i for seq in ex["resposta"] for i in seq}
            for b in ex["blocos"]:
                p.append(f"- `{b['id']}`: `{b['codigo'].strip()}`" + ("" if b["id"] in usados else " (distrator)"))
            if ex.get("codigo_depois"):
                p += ["", "Linhas fixas depois:", "", _bloco(ex["codigo_depois"], "python")]
            p += ["", "Ordens aceitas: " + "; ".join(" → ".join(seq) for seq in ex["resposta"]), ""]
        elif ex["tipo"] == "localizar_erro":
            p += [f"Resposta: linha {ex['resposta']} ({ex['erro']}). Correção: `{ex['correcao'].strip()}`", ""]
        for i, d in enumerate(ex["dicas"], 1):
            p.append(f"- Dica {i}: {d}")
        p += ["", f"**Explicação:** {ex['explicacao']}", ""]
        p.append("Conceitos: " + ", ".join(nomes.get(c, c) for c in ex["conceitos"]) + f". Objetivo: {ex['objetivo']}")
        p.append("")

    for licao in licoes:
        p += [f"## Lição {licao['ordem']} — {licao['titulo']}", "", f"Objetivo: {licao['objetivo']}", "", "### Sessão principal", ""]
        for ex in licao.get("exercicios") or []:
            exercicio(ex)
        if licao.get("revisao"):
            p += ["### Variações de revisão", ""]
            for ex in licao["revisao"]:
                exercicio(ex)
    (pasta / "LEITURA.md").write_text("\n".join(p).rstrip() + "\n", encoding="utf-8", newline="\n")


def main():
    parser = argparse.ArgumentParser(description="Valida e verifica o conteúdo de uma unidade.")
    parser.add_argument("pasta", type=Path)
    parser.add_argument("--leitura", action="store_true", help="gera LEITURA.md na pasta da unidade")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

    rel = Relatorio()
    unidade, licoes = verificar_unidade(args.pasta, rel)
    total = sum(len(lc.get("exercicios") or []) for lc in licoes)
    variacoes = sum(len(lc.get("revisao") or []) for lc in licoes)

    print(f"Python {sys.version.split()[0]}")
    print(f"Unidade {unidade.get('id')}: {len(licoes)} lições, {total} exercícios principais, {variacoes} variações de revisão")
    for a in rel.avisos:
        print(f"AVISO  {a}")
    for e in rel.erros:
        print(f"ERRO   {e}")
    if rel.erros:
        print(f"{len(rel.erros)} erro(s).")
        sys.exit(1)
    print("Nenhum erro.")
    if args.leitura:
        gerar_leitura(args.pasta, unidade, licoes)
        print(f"Gerado {args.pasta / 'LEITURA.md'}")


if __name__ == "__main__":
    main()
