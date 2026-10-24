# Estudos de caso de engenharia | Engineering case studies

**PT** | [EN](#english)

Repositório de estudos de caso de **Alify Lopes**, engenheiro de IA e software, exibidos no [portfólio](https://devalify.github.io/devalify/). [LinkedIn](https://www.linkedin.com/in/alify-silva/) · [GitHub](https://github.com/DevAlify)

Aqui há só texto: problema, contexto, arquitetura, decisões, números e aprendizados. O código dos projetos é privado e não está neste repositório.

## Casos

| Caso | Stack | Destaque |
| --- | --- | --- |
| [Agente de IA para suporte N1](cases/ai-support-agent.md) | TypeScript, Claude, Vercel AI SDK, MCP, AWS Lambda, pgvector | Servidor MCP somente leitura com 31 consultas fechadas, 430+ testes e evals com casos selados |
| [ERP e backoffice da syphrax](cases/syphrax-erp.md) | Next.js 16, React 19, PostgreSQL 17, pg-boss | 15 áreas, 68 tabelas, 2.242 casos de teste, auditoria append-only imposta no banco |
| [Genoma: ERP na infraestrutura do cliente](cases/genoma-erp.md) | Next.js 16, PostgreSQL 17 com RLS, Docker Compose, PHP | Isolamento multi-loja no banco, deploy com rollback automático, teste de restauração mensal |
| [Argos: revisor de PRs com LLM](cases/llm-pr-reviewer.md) | Node.js, Codex CLI, JSON Schema, seccomp, AppArmor | Executor sem escrita, saída validada por schema, filtro de segredos, 198 testes |
| [Agente de currículo sob medida](cases/career-automation.md) | Python, JSON Schema, Claude e Codex | Redige com um modelo, revisa com outro, valida lastro e guarda contra prompt injection |

## Como ler

Cada caso tem a versão em português e, abaixo, a versão em inglês no mesmo arquivo. A estrutura é a mesma: problema, arquitetura, decisões técnicas, números, o que aprendi e limites. A seção de limites diz o que não afirmo. Contagem de testes não é cobertura percentual e não é ganho de negócio.

---

## English

Case studies by **Alify Lopes**, AI and software engineer, shown in the [portfolio](https://devalify.github.io/devalify/). [LinkedIn](https://www.linkedin.com/in/alify-silva/) · [GitHub](https://github.com/DevAlify)

This repository holds text only: problem, context, architecture, decisions, numbers and lessons. Project code is private and not included.

| Case | Stack | Highlight |
| --- | --- | --- |
| [L1 support AI agent](cases/ai-support-agent.md) | TypeScript, Claude, Vercel AI SDK, MCP, AWS Lambda, pgvector | Read-only MCP server with 31 fixed queries, 430+ tests, evals with sealed cases |
| [syphrax ERP and back office](cases/syphrax-erp.md) | Next.js 16, React 19, PostgreSQL 17, pg-boss | 15 areas, 68 tables, 2,242 test cases, append-only audit enforced in the database |
| [Genoma: ERP on the customer's infrastructure](cases/genoma-erp.md) | Next.js 16, PostgreSQL 17 with RLS, Docker Compose, PHP | Database-level multi-store isolation, auto-rollback deploys, monthly restore test |
| [Argos: LLM pull request reviewer](cases/llm-pr-reviewer.md) | Node.js, Codex CLI, JSON Schema, seccomp, AppArmor | Write-less executor, schema-validated output, secret filter, 198 tests |
| [Tailored resume agent](cases/career-automation.md) | Python, JSON Schema, Claude and Codex | One model drafts, another reviews, backing validation and prompt injection guard |

Each case has a Portuguese section followed by an English one in the same file, with the same structure, ending with a limits section that states what I do not claim. Test counts are not coverage percentages and not business gains.
