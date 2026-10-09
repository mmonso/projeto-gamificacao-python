"""Exporta o conteúdo da unidade 1 para o protótipo navegável.

Uso:
    python ferramentas/exportar_prototipo.py

Gera design/prototipo/dados.js. O protótipo corrige as respostas no navegador
apenas para demonstração; no produto, a resposta fica no servidor (F-15).
"""

import json
from pathlib import Path

import yaml

RAIZ = Path(__file__).resolve().parent.parent
UNIDADE = RAIZ / "conteudo" / "unidade-1"
DESTINO = RAIZ / "design" / "prototipo" / "dados.js"

# Unidades seguintes ainda não escritas; só aparecem bloqueadas na trilha.
UNIDADES_FUTURAS = [
    {"id": "u2", "ordem": 2, "titulo": "Valores e operações", "descricao": "Tipos, números, textos e operadores."},
    {"id": "u3", "ordem": 3, "titulo": "Decisões", "descricao": "Comparações e if/else."},
]


def carregar(caminho):
    with open(caminho, encoding="utf-8") as f:
        return yaml.safe_load(f)


def main():
    unidade = carregar(UNIDADE / "unidade.yaml")
    licoes = sorted((carregar(p) for p in UNIDADE.glob("licao-*.yaml")), key=lambda lc: lc["ordem"])
    dados = {
        "unidades": [
            {
                "id": unidade["id"],
                "ordem": unidade["ordem"],
                "titulo": unidade["titulo"],
                "descricao": unidade["descricao"],
                "licoes": licoes,
            },
            *UNIDADES_FUTURAS,
        ],
    }
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    texto = "// Gerado por ferramentas/exportar_prototipo.py. Não edite à mão.\nwindow.CONTEUDO = "
    texto += json.dumps(dados, ensure_ascii=False, indent=1) + ";\n"
    DESTINO.write_text(texto, encoding="utf-8", newline="\n")
    print(f"Gerado {DESTINO.relative_to(RAIZ)} com {sum(len(lc['exercicios']) for lc in licoes)} exercícios")


if __name__ == "__main__":
    main()
