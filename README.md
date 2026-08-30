# SATUU

> Repositório recém-criado. O escopo e a stack ainda não foram definidos.

## Status

| Item | Situação |
| --- | --- |
| Repositório | Criado |
| Objetivo | A definir |
| Stack | A definir |
| Licença | A definir |

## Sobre

_Descreva aqui o que o projeto faz, para quem serve e qual problema resolve._

## Como começar

Ainda não há dependências nem build configurados. Assim que a stack for
escolhida, esta seção passa a conter os comandos de instalação e execução.

```bash
git clone https://github.com/therunnas/SATUU.git
cd SATUU
```

## Estrutura

```
.
├── docs/          documentação e decisões
├── src/           código-fonte
├── .editorconfig  convenções de formatação
├── .gitignore     artefatos fora do versionamento
├── AGENTS.md      ponteiro para o CLAUDE.md
└── CLAUDE.md      contrato de trabalho: regras e fluxo de Issue e PR
```

## Como o trabalho entra

Nada entra no `main` fora deste caminho:

```
Issue  →  branch  →  commits  →  PR (referencia a Issue)  →  review  →  merge
```

Os três tipos de tarefa são **Correção**, **Melhoria** e **Nova função**. O
contrato completo está em [CLAUDE.md](CLAUDE.md).
