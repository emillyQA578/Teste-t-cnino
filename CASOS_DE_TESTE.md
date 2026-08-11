# Casos de teste — TMS Lite

<!--
Um caso de teste precisa ser executável por outra pessoa sem que você esteja
por perto. Pré-condição clara, passos numerados e um único resultado esperado.

Inclua casos que passaram, não só os que falharam — a cobertura também é
resultado.

Repita o bloco abaixo para cada caso.
-->

## CT-01 — Validação de consistência entre data estimada e dados do cliente

| | |
|---|---|
| **Funcionalidade** | prazo |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré-condição:**
Dados resetados via `POST /_reset`. Existe uma transportadora ativa com prazo de 3 dias úteis. A entrega será criada com `data_coleta = 2026-07-02`, cidade e UF válidas e cliente com dados completos.

**Passos:**
1. Resetar os dados do sistema.
2. Criar uma entrega com `id_transportadora` ativa, `cidade`, `uf`, `peso_kg` e `volumes` válidos.
3. Informar `data_coleta` como `2026-07-02`.
4. Consultar a entrega criada por `GET /api/entregas/{id}`.
5. Verificar a `data_prazo` retornada.

**Resultado esperado:**
A data de prazo deve ser calculada considerando apenas dias úteis, conforme a regra do README: coleta em 02/07/2026 (quinta) + 3 dias úteis resulta em 07/07/2026 (terça), ignorando sábado e domingo. A data exibida deve refletir o prazo da transportadora e não uma data genérica ou padrão para todos os clientes.

**Resultado obtido:**
A API retornou a entrega criada com `data_coleta = 2026-07-02` e `data_prazo = 2026-07-07`, confirmando o cálculo de 3 dias úteis: sexta, segunda e terça. O resultado observado está em conformidade com a regra do README e não apresentou data padrão ou divergência para o cliente testado.

**Status:** Passou

**Bug relacionado:** Nenhum

---

## CT-02 — Data estimada inconsistente quando a regra de negócio não é aplicada

| | |
|---|---|
| **Funcionalidade** | prazo |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:**
Dados resetados via `POST /_reset`. Existe uma transportadora ativa com `prazo_dias = 3` e uma entrega com `data_coleta = 2026-07-02`.

**Passos:**
1. Resetar os dados do sistema.
2. Criar uma entrega válida com cidade, UF e transportadora ativa.
3. Consultar a entrega após a criação.
4. Verificar se a data calculada considera os dias úteis corretamente.
5. Comparar o resultado com a regra esperada da transportadora.

**Resultado esperado:**
O sistema deve rejeitar ou evidenciar qualquer cálculo que ignore os dias úteis, usando uma data padrão ou inconsistência entre cidade/UF e prazo. A regra do README determina que o cálculo deve seguir a lógica de dias úteis, e a data não pode ser aleatória, fixa para todos ou divergente da regra contratada.

**Resultado obtido:**
A API retornou `data_coleta = 2026-07-02` e `data_prazo = 2026-07-07`, mostrando que o sistema calculou corretamente os 3 dias úteis e não aplicou uma data genérica ou inconsistente. O cenário negativo validado não revelou falha de regra para esse caso de teste.

**Status:** Passou

**Bug relacionado:** Nenhum
