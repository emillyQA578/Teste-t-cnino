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
Quais tipos de testes podem ser feitos para cobrir esse bug? 
-Teste de API 
validar os endpoints que retornam as entregas e suas datas estimadas;
confirmar que a resposta contém o valor esperado para diferentes cenários.

-Teste de interface (UI)
validar se a tela exibe a data estimada corretamente para diferentes entregas;
verificar se a informação não fica inconsistente ou padrão para todos os casos.

## 5. Riscos e priorização

| Área | Risco se falhar | Prioridade |
|---|---|---|
| Cálculo de data estimada de entrega | A entrega pode receber uma data inconsistente, padrão ou incorreta, gerando erros de planejamento, atraso na entrega e perda de confiança do cliente | Alta |
| Regras de negócio por região/UF e tipo de transporte | O sistema pode ignorar regras específicas do cliente e da rota, causando decisões equivocadas e falhas operacionais | Alta |
| Integração entre API e interface | A API pode devolver dados corretos, mas a tela pode exibir valor divergente, criando inconsistência para usuários e suporte | Alta |
| Validação de dados do cliente e do pedido | Informações incompletas ou inconsistentes podem gerar estimativas erradas e impactar a confiabilidade do processo | Média |
| Fluxo de visualização em lista/detalhe | Usuários podem confundir a informação em diferentes telas, gerando retrabalho e falhas de comunicação | Média |

## 6. Critérios de entrada e saída

Critérios de entrada:
- o ambiente de teste está disponível e acessível;
- existe ao menos uma entrega cadastrada com dados válidos de cliente, cidade, UF, tipo de transporte e datas estimadas;
- as regras de negócio para cálculo da data de entrega estão documentadas ou disponíveis para comparação;
- a API e a interface de listagem/detalhe estão funcionando em ambiente de homologação ou local.

Critérios de saída:
- todos os cenários prioritários de data estimada foram validados;
- a data exibida na interface não diverge da regra de negócio e dos dados do cliente;
- não há inconsistência entre os dados retornados pela API e a apresentação na tela;
- os defeitos críticos encontrados foram registrados e priorizados para correção;
- a equipe considera o teste concluído quando os riscos principais de negócio foram verificados e não há evidência de falha crítica no fluxo analisado.

## 7. Cronograma

O cronograma deve começar com a preparação do ambiente e a revisão das regras de negócio. Em seguida, valida-se a API para confirmar se a data estimada está sendo calculada corretamente para diferentes cenários. Depois, testa-se a interface para verificar se a informação exibida é consistente com os dados do cliente e com a regra aplicada. Por fim, revisam-se os defeitos, validam-se os casos limites e fecha-se o ciclo quando os riscos principais forem avaliados e não houver inconsistência crítica.
