# AGENTS.md

As instruções para agentes de IA neste repositório estão em **[CLAUDE.md](CLAUDE.md)**.

Fonte única, para não divergirem. Este arquivo existe apenas porque algumas
ferramentas procuram por `AGENTS.md` em vez de `CLAUDE.md` — o conteúdo vale
igual, seja qual for o modelo ou o cliente.

Leia `CLAUDE.md` inteiro antes da primeira ação. Em resumo:

- **Projeto novo.** Stack e escopo ainda não definidos — não escolha por conta
  própria e não traga código ou convenções de outro projeto.
- Toda tarefa começa por uma **Issue**, com tipo `Correção`, `Melhoria` ou `Nova função`
- Uma **branch por Issue**, nunca commit direto no `main`
- Todo **PR referencia a Issue** com `Closes #<n>`
- Testes verdes antes e depois de mudar
- Nenhum segredo no repositório
