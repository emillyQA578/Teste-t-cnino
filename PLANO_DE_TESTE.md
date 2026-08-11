# Plano de teste — TMS Lite

<!--
Preencha este arquivo antes de sair testando. O plano é o registro do seu
raciocínio: o que você decidiu olhar, em que ordem e por quê.
Não precisa ser longo. Precisa ser justificado.
-->

## 1. Objetivo

<!-- O que este ciclo de teste precisa responder. --> o sistema é confiável? 
De primeira mão, já tenho uma resposta, NÃO. Nenhum sistema por si só é confiavel , todos precisam de testes, revisões e refatorações. 

## 2. Escopo

### Dentro do escopo

<!-- Funcionalidades, camadas (UI, API) e cenários que você vai cobrir. -->
O que vou cobrir pois considirei prioridade? Data estimada

- Cenário: validação de consistência entre data estimada e dados do cliente
- Pré-condição: existe uma entrega cadastrada com um cliente, cidade, UF e data de coleta/entrega estimada.
- Passos:
  1. Acessar a tela de detalhe ou a lista de entregas.
  2. Selecionar uma entrega específica.
  3. Verificar se a data estimada de entrega está coerente com as informações do cliente, como:
     - região/UF do destino;
     - tipo de transporte;
     - prazo informado na regra de negócio.
- Resultado esperado:
  - a data estimada de entrega deve ser calculada ou exibida de acordo com as regras definidas;
  - não deve haver divergência entre a data apresentada e os dados usados para o cálculo;
- o sistema não pode trazer uma data padrão para todos, deve considerar as informações de região e tipo de transporte.

Quais tipos de testes podem ser feitos para cobrir esse bug? 
-Teste de API 
validar os endpoints que retornam as entregas e suas datas estimadas;
confirmar que a resposta contém o valor esperado para diferentes cenários.

-Teste de interface (UI)
validar se a tela exibe a data estimada corretamente para diferentes entregas;
verificar se a informação não fica inconsistente ou padrão para todos os casos.

Exemplo de risco que esse cenário cobre:
- o sistema calcula a data estimada com base em um prazo incorreto ou em uma regra desatualizada, gerando uma data que não condiz com a realidade do cliente.

Por que isso é prioridade?
Este defeito deve ser priorizado porque impacta diretamente a confiabilidade das informações disponibilizadas ao cliente, comprometendo a credibilidade do processo e aumentando o risco de tomada de decisão baseada em dados incorretos.

### Fora do escopo

<!-- O que você decidiu não testar. Justifique cada exclusão. -->

## 3. Ambiente

<!-- Versão do Node, sistema operacional, navegador, URL, como resetar os dados. -->

## 4. Estratégia

<!--
Como você vai testar: exploratório, baseado em requisito, teste de contrato
de API, teste de tela... Diga também como usou o README como referência.
-->

## 5. Riscos e priorização

<!--
Quais áreas do sistema oferecem mais risco ao negócio e por isso recebem mais
atenção. Uma tabela ajuda:

| Área | Risco se falhar | Prioridade |
|---|---|---|
|  |  |  |
-->

## 6. Critérios de entrada e saída

<!-- Quando você considera o teste iniciado e quando considera concluído. -->

## 7. Cronograma

<!-- Como distribuiu o tempo disponível entre as atividades. -->
