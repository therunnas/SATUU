# Registro de decisões

Histórico curto das decisões técnicas do projeto: o que foi decidido, quando e
por quê. Serve para que ninguém precise reconstruir o raciocínio meses depois.

---

## 2026-08-30 — Repositório criado

**Contexto.** O SATUU nasce como projeto independente, sem relação de código com
nenhum outro repositório.

**Decisão.** Começar com uma base neutra em relação à linguagem — README,
`.gitignore`, `.editorconfig`, `CLAUDE.md` e este registro — em vez de já montar
o scaffold de uma stack.

**Motivo.** Escolher framework antes de conhecer o objetivo do projeto costuma
gerar retrabalho. A base neutra é aproveitada por qualquer stack.

**Consequências.** O primeiro commit vai direto para o `main`, porque a regra de
"nunca commitar no `main`" precisa de um `main` que já exista para servir de base
aos PRs. A partir do segundo commit, o fluxo Issue → branch → PR vale sempre.

**Pendências.** Definir objetivo, stack, licença e pipeline de CI.

---

## Modelo para novas entradas

```
## AAAA-MM-DD — Título da decisão

**Contexto.** Qual era a situação.

**Decisão.** O que foi decidido.

**Motivo.** Por que essa opção e não as alternativas.

**Consequências.** O que isso passa a exigir ou impedir.
```
