# Resposta à área de operações

<!--
Escreva para a Camila, que coordena Operações e não é da área técnica.

O que se espera desta mensagem:
- responder objetivamente à pergunta dela: dá para confiar no sistema hoje?
- explicar o problema mais grave em linguagem de negócio — sem endpoint, sem
  código de status HTTP, sem nome de arquivo;
- dizer qual é o impacto prático para a operação e para o cliente;
- indicar o que ela pode fazer enquanto o problema não for corrigido;
- ser honesto sobre o que ainda não se sabe.

Tamanho sugerido: o que caberia em um e-mail que ela leia de uma vez.
Apague estes comentários antes de entregar.
-->

**Para:** Camila Ferraz — Coordenação de Operações
**Assunto:** Confiabilidade do sistema e risco na informação de prazo de entrega

Olá Camila,

Em resposta à sua pergunta, hoje não dá para afirmar que o sistema está 100% seguro e confiável. Durante a análise do fluxo de entregas, identificamos que a data estimada de entrega pode deixar de refletir corretamente a regra de negócio e, com isso, gerar informação inconsistente para a operação e para o cliente.

O problema mais grave está na forma como o prazo é calculado e apresentado. Quando a data não considera corretamente os parâmetros relevantes.
Enquanto essa questão não for corrigida, o mais prudente é validar manualmente as datas mais importantes antes de confirmar qualquer prazo ao cliente e registrar divergências enquanto revisamos a regra de cálculo para entregas.

Atenciosamente,

Emilly Marques.
