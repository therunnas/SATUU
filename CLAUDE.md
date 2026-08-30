# CLAUDE.md — contrato de trabalho no SATUU

Instruções para qualquer agente de IA que trabalhe neste repositório,
independente do modelo ou da ferramenta. Leia este arquivo inteiro antes da
primeira ação.

---

## 1. Estado do projeto

**Projeto novo. Não há stack, dependências nem build definidos.**

Antes de escrever qualquer código de aplicação, confirme com o dono do projeto
qual é o objetivo e qual stack usar. **Não assuma e não comece a construir por
conta própria** — um scaffold errado custa mais para remover do que para não ter
sido feito.

Este repositório é independente. Não importe código, decisões ou convenções de
outros projetos sem que isso tenha sido pedido explicitamente.

---

## 2. Fluxo de trabalho: Issue → branch → PR

Nada entra no `main` sem passar por este caminho. Vale para tarefa de uma linha.

```
Issue  →  branch  →  commits  →  PR (referencia a Issue)  →  review  →  merge
```

### Passo 1 — Toda tarefa começa por uma Issue

Antes de escrever código, abra a Issue. Se a tarefa veio de um pedido em conversa,
a Issue é criada primeiro — ela é o registro, a conversa não é.

**Os três tipos.** O tipo vai no título entre colchetes **e** como rótulo:

| Tipo | Rótulo | Quando usar |
| --- | --- | --- |
| **Correção** | `correção` | Algo está quebrado ou se comporta errado |
| **Melhoria** | `melhoria` | Algo funciona, mas pode ficar melhor |
| **Nova função** | `nova função` | Capacidade que não existe hoje |

Título: `[Tipo] Descrição no imperativo ou no fato observado`

Corpo, nesta estrutura:

```markdown
## Contexto
Por que isso existe. O que acontece hoje.

## O que fazer
Passos ou escopo. Direto.

## Critério de aceite
- [ ] Condições verificáveis, não vagas

## Referências
Arquivos e seções da documentação envolvidos.
```

Escreva o critério de aceite de forma que dê para **conferir**. Se a tarefa
depender de outra, diga no corpo: `Depende de #10`.

### Passo 2 — Uma branch por Issue

```
<tipo>/<número-da-issue>-<slug-curto>
```

| Tipo | Prefixo | Exemplo |
| --- | --- | --- |
| Correção | `correcao/` | `correcao/9-login-expira` |
| Melhoria | `melhoria/` | `melhoria/17-cache-consulta` |
| Nova função | `funcao/` | `funcao/12-convite-usuarios` |

Sem acento no nome da branch. Nunca commite direto no `main`.

### Passo 3 — Commits

Mensagem no imperativo, explicando **o porquê** — o diff já mostra o quê.

```
Resumo em uma linha, até ~70 caracteres

O corpo explica a razão da mudança e o que ela evita. Se houve decisão
entre alternativas, registre qual e por quê.
```

### Passo 4 — O PR referencia a Issue

**Obrigatório.** Todo PR aponta para a Issue que o originou, no corpo:

```markdown
Closes #17

## O que muda
Resumo do diff em uma ou duas frases.

## Por quê
O problema que isso resolve.

## Como verificar
Passos para conferir, com os números reais quando houver medição.

## Checklist
- [ ] Testes verdes
- [ ] Build sem erro
- [ ] Lint sem avisos novos
- [ ] Nenhum segredo no repositório
```

`Closes #<n>` fecha a Issue automaticamente no merge. Use `Refs #<n>` quando o PR
avança a Issue sem concluí-la.

Um PR resolve **uma** Issue. Se estiver fechando duas, provavelmente são dois PRs
— a exceção é quando as mudanças são inseparáveis, e aí o corpo explica por quê.

### Passo 5 — Deploy

O merge no `main` é o gatilho de deploy. Por isso o `main` está sempre
publicável: teste vermelho ou build quebrado não entram.

---

## 3. Regras que já valem

**Segurança**

- **Nenhum segredo no repositório.** Chaves ficam em variáveis de ambiente ou em
  secrets do provedor. O `.env` está no `.gitignore` — mantenha um `.env.example`
  com os nomes esperados e nenhum valor real.

**Qualidade**

- **Rode os testes antes e depois de mudar.** Se quebrar, conserte antes de
  seguir. Nunca abra PR com teste vermelho.
- Número que aparece em documento envelhece. Confira antes de repetir num PR.

**Documentação**

- Decisões relevantes de arquitetura vão para `docs/`, com o motivo — não só a
  escolha.

Quando a stack for definida, as regras específicas de arquitetura entram nesta
seção.

---

## 4. Idioma

- Documentação, comentários, Issues, PRs e mensagens de commit: **português**
- Nomes de código — variáveis, funções, arquivos: **inglês**

---

## 5. Quando não seguir em frente

Pare e pergunte antes de:

- Escolher ou trocar a stack por conta própria
- Colocar qualquer chave ou segredo no repositório
- Apagar ou sobrescrever trabalho de outra pessoa para resolver um conflito
- Trazer código ou convenções de outro projeto

Divergência entre este arquivo e o que alguém pediu na conversa: siga este
arquivo e diga que há divergência.
