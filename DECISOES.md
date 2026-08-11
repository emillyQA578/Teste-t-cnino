# Decisões

<!--
Este arquivo vale tanto quanto a lista de problemas encontrados. É aqui que
você mostra critério: o que escolheu não fazer, o que interpretou por conta
própria e o que investigou e concluiu que estava certo.
-->

## 1. O que ficou de fora

| Item não coberto | Por quê | Risco de deixar assim |
|---|---|---|
| Casos de regressão em outras rotas e status | Foquei na regra crítica de prazo e no tempo disponível | Pequeno, mas pode esconder problemas fora do escopo principal |
| Testes aprofundados de interface/UX | O objetivo principal era validar a regra de negócio e a consistência de dados | Médio, pois a tela pode mostrar informação diferente da API |
| Cobertura de todos os estados e UF/transportadoras | Precisava priorizar cenários mais relevantes para a regra estudada | Médio, porque alguns casos limítrofes podem não ter sido cobertos |

## 2. Ambiguidades e interpretações

A documentação não detalha todas as regras por região, UF ou tipo de transporte. Então, adotei a regra explícita do README: prazo em dias úteis, ignorando sábado e domingo, e cálculo pela transportadora.

## 3. Comportamentos que investiguei e considerei corretos

- O cálculo de prazo respeita dias úteis.
- O sistema ignora sábado e domingo no cálculo.
- Entregas canceladas ficam fora da listagem padrão.
- Transportadoras inativas não aceitam novas entregas.

## 4. Critério de severidade

- Crítico: erro no prazo/entrega que afeta planejamento e confiança do cliente.
- Alto: inconsistência entre API e interface ou regra de negócio.
- Médio: dados incompletos ou cenários limitados sem impacto imediato grave.
- Baixo: problemas de apresentação ou linguagem sem risco operacional.

## 5. O que eu faria com mais tempo

- automatizar casos de API e UI;
- testar mais UF, cidades e transportadoras;
- validar regras com PO e desenvolvedores;
- aumentar a cobertura de casos de limite e regressão;
- reforçar documentação do comportamento esperado.
