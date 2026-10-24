# Exemplo educacional de idempotência

Exemplo novo para este portfólio, escrito em JavaScript com módulos ES e usando apenas a biblioteca padrão do Node.js. Não é a implementação de nenhum produto nem de um sistema de pagamentos real.

## O que demonstra

- Um evento sintético repetido aplica a operação uma vez por identidade de cliente e evento.
- Chamadas concorrentes compartilham a mesma operação em andamento, em um único processo.
- A mesma chave com valores de negócio diferentes é rejeitada.
- Uma operação que falhou permite nova tentativa.
- Valores e identidades inválidos são rejeitados antes da operação de negócio.

Requer Node.js 20+, sem dependências:

```bash
node --test examples/webhook-idempotency/index.test.mjs
```

O comando deve ser executado na raiz do repositório. Os nove testes usam dados sintéticos e operações locais, sem APIs, credenciais ou cobranças.

## Limites de produção

O estado é mantido em memória e desaparece ao reiniciar o processo. Não há persistência, coordenação entre instâncias, verificação de assinatura ou endpoint HTTP. O `tenantId` do exemplo é sintético; em um sistema real, a identidade precisa vir de um contexto validado.

O callback e o registro de deduplicação não fazem parte de uma transação durável. Se o callback concluir um efeito externo e depois falhar, uma nova tentativa pode repetir esse efeito. Produção exige projetar persistência, restrições únicas, transações, efeitos externos e política de retry em conjunto.

Este exemplo demonstra um mecanismo local. Não promete processamento exatamente uma vez em um sistema distribuído.

## English

A new educational portfolio example using JavaScript ES modules and Node.js built-ins. It is separate from any professional implementation. Nine tests use synthetic events and local operations.

The example demonstrates per-tenant event deduplication, concurrent replay sharing in a single process, conflicting-payload rejection and retry after failure. State is in memory; it does not provide durable or distributed exactly-once processing. A production design must handle persistence, signature verification, trusted tenant identity, transaction boundaries and external side effects.
