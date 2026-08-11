# Desafio técnico — QA

Bem-vindo(a). Este repositório contém o **TMS Lite**, um sistema interno de
acompanhamento de entregas que está em uso pela área de operações.

Comece lendo o [RELATO_OPERACAO.md](RELATO_OPERACAO.md) — é a mensagem que
originou este trabalho. Depois leia o [README.md](README.md), que descreve como
o sistema deve se comportar.

---

## Sua missão

Avaliar a qualidade do TMS Lite e responder, com evidência, à pergunta da
Camila: **dá para confiar nesse sistema hoje?**

O relato dela é vago e incompleto de propósito — é assim que os relatos chegam.
Cabe a você ampliar a investigação, decidir onde olhar e sustentar as conclusões.

O README é a referência de comportamento esperado. Sempre que o sistema fizer
algo diferente do que está documentado lá, você tem um achado.

---

## Entregáveis

| Arquivo | O que deve conter |
|---|---|
| `PLANO_DE_TESTE.md` | Escopo, o que priorizou e por quê, ambiente, riscos considerados |
| `CASOS_DE_TESTE.md` | Casos com pré-condição, passos e resultado esperado |
| `bugs/` | Um arquivo por problema encontrado, no formato de `bugs/_TEMPLATE.md` |
| `automacao/` | Ao menos **3 cenários críticos** automatizados e rodáveis |
| `RESPOSTA_OPERACAO.md` | Resposta à Camila sobre o problema mais grave, em linguagem de negócio |
| `DECISOES.md` | O que ficou de fora, o que você interpretou e por quê |

### Sobre os bug reports

Use o template de `bugs/_TEMPLATE.md`, um arquivo por problema
(`bugs/BUG-01-titulo-curto.md`). O que avaliamos aqui é se **outra pessoa
consegue reproduzir** o problema seguindo apenas o que você escreveu, e se a
severidade que você atribuiu se sustenta.

Nem tudo que parece errado está errado. Se encontrar um comportamento que
estranhou mas que o README explica, isso também é um resultado — registre em
`DECISOES.md` o que investigou e por que concluiu que não é um problema.

### Sobre a automação

Ferramenta livre: `node:test` com `fetch`, Playwright, Postman/Newman, pytest,
o que você preferir. Só pedimos que:

- rode com um comando único, documentado em `automacao/README.md`;
- os 3 cenários sejam escolhidos por **risco**, não por facilidade — e que você
  justifique a escolha;
- os testes falhem de verdade quando o comportamento estiver errado.

Se a sua ferramenta exigir instalação, deixe isso claro no `automacao/README.md`.
O sistema em si roda sem instalar nada.

---

## Como entregar

1. Repositório **público** no GitHub, sem menção ao nome da empresa.
2. **Commits incrementais.** Queremos ver o raciocínio em etapas — um commit
   único com tudo pronto não nos diz nada sobre como você trabalha.
3. README próprio explicando como rodar a sua automação.
4. Envie ao recrutador: nome completo, link do repositório e LinkedIn.

**Prazo:** 5 dias corridos a partir do recebimento.

---

## Regras do jogo

- **Não corrija o sistema.** Seu papel aqui é testar e reportar, não consertar.
- **Ambiguidade no enunciado:** documente a interpretação que adotou em
  `DECISOES.md` e siga em frente. Decidir sob incerteza faz parte da avaliação.
- **Não conseguiu cobrir tudo?** Normal, e esperado. Diga o que ficou de fora e
  por quê. Preferimos cobertura consciente e justificada a uma lista extensa
  sem critério.
- Use IA se quiser, desde que você entenda e saiba defender tudo o que entregar.
  Vamos conversar sobre as suas decisões na devolutiva.

---

## O que avaliamos

- **Cobertura** — quantos e quais problemas você encontrou.
- **Qualidade do report** — reprodutibilidade, evidência, severidade coerente.
- **Priorização por risco** — o que você tratou primeiro e por quê.
- **Automação** — escolha dos cenários, legibilidade e se roda de fato.
- **Comunicação com não-técnico** — a resposta à Camila.
- **Decisão sob incerteza** — o que não testou e como justificou.
- **Higiene de engenharia** — commits, organização, instruções de execução.

Boa sorte.
