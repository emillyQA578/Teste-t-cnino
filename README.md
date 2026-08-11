# TMS Lite

Sistema interno de acompanhamento de entregas. Cadastra transportadoras e
entregas, controla o fluxo de status de cada entrega e calcula o prazo de
entrega a partir do prazo contratado da transportadora.

Este documento descreve **como o sistema deve se comportar**. Use-o como
referência ao avaliar qualquer resultado que a aplicação apresentar.

---

## Por onde começar

Leia nesta ordem:

1. **[RELATO_OPERACAO.md](./RELATO_OPERACAO.md)** — a reclamação que chegou do
   time de operações. É o ponto de partida do desafio.
2. **[DESAFIO.md](./DESAFIO.md)** — o que você precisa entregar, o prazo e como
   enviar.
3. **Este README** — as regras de negócio e o contrato da API. É a referência
   para decidir se um comportamento está certo ou errado.

## O que você vai entregar

Cada arquivo abaixo já está no repositório, com as seções prontas para
preencher. O detalhamento do que se espera de cada um está no
[DESAFIO.md](./DESAFIO.md).

| Arquivo | O que colocar nele |
|---------|--------------------|
| [PLANO_DE_TESTE.md](./PLANO_DE_TESTE.md) | Escopo, prioridades, ambiente e riscos considerados |
| [CASOS_DE_TESTE.md](./CASOS_DE_TESTE.md) | Seus casos, com pré-condição, passos e resultado esperado |
| [bugs/](./bugs/) | Um arquivo por problema encontrado, seguindo o [modelo](./bugs/_TEMPLATE.md) |
| [automacao/](./automacao/) | Sua suíte automatizada e as instruções de execução ([leia primeiro](./automacao/README.md)) |
| [RESPOSTA_OPERACAO.md](./RESPOSTA_OPERACAO.md) | A resposta ao time de operações, sem jargão técnico |
| [DECISOES.md](./DECISOES.md) | O que você deixou de fora, o que interpretou e por quê |

---

## Como rodar

**Requisito:** Node.js 18 ou superior. Nada além disso — o projeto não tem
dependências externas e não precisa de `npm install`, banco de dados ou Docker.

### Já tem o Node instalado?

Abra o terminal e rode:

```bash
node --version
```

Se aparecer `v18` ou maior, está pronto — pule para o passo seguinte. Se aparecer
`command not found` (macOS/Linux) ou `não é reconhecido como um comando`
(Windows), instale por um destes caminhos:

| Sistema | Como instalar |
|---------|---------------|
| Qualquer um | Baixe a versão **LTS** em <https://nodejs.org/pt-br/download> e siga o instalador |
| Windows (terminal) | `winget install OpenJS.NodeJS.LTS` |
| macOS (Homebrew) | `brew install node` |
| Linux, ou quem prefere alternar versões | [nvm](https://github.com/nvm-sh/nvm) e depois `nvm install --lts` |

Feche e reabra o terminal depois de instalar, e confira de novo com
`node --version`. Qualquer versão LTS a partir da 18 serve.

> Se a máquina for corporativa e bloquear a instalação, avise o recrutador —
> a gente resolve.

### Subindo a aplicação

```bash
node server.js
```

A aplicação sobe em `http://localhost:3000`. Para usar outra porta:

```bash
PORT=3005 node server.js
```

### Dados

Os dados ficam em memória e são recriados a cada inicialização, sempre a partir
do mesmo conjunto inicial: **5 transportadoras** e **42 entregas**.

Pode alterar os dados à vontade. Para voltar ao estado inicial sem reiniciar o
servidor, use o botão **"Resetar dados"** no topo da tela ou chame
`POST /_reset`.

---

## Regras de negócio

### Fluxo de status da entrega

Toda entrega nasce como `CRIADA` e avança uma etapa por vez:

```
CRIADA → COLETADA → EM_TRANSITO → SAIU_ENTREGA → ENTREGUE
                                              ↘ DEVOLVIDA
```

- A entrega só pode avançar para o **próximo** status do fluxo. Pular etapas
  não é permitido: uma entrega `CRIADA` não pode ir direto para `ENTREGUE`.
- A partir de `SAIU_ENTREGA` a entrega pode terminar em `ENTREGUE` ou em
  `DEVOLVIDA`.
- O cancelamento (`CANCELADA`) é permitido apenas enquanto a entrega estiver em
  `CRIADA` ou `COLETADA`. Depois que a carga entra em trânsito não há mais
  cancelamento.
- `ENTREGUE`, `DEVOLVIDA` e `CANCELADA` são status finais: uma entrega nesses
  status não muda mais.
- Qualquer transição fora desse fluxo é recusada com `422` e não altera a
  entrega.
- Toda mudança de status aceita gera um registro no histórico da entrega, com
  status, data e descrição.

### Prazo de entrega

`data_prazo` = `data_coleta` + `prazo_dias` da transportadora, contados **em
dias úteis**. Sábados e domingos não entram na contagem.

Exemplo: coleta na quinta-feira 02/07/2026, transportadora com `prazo_dias = 3`.
Contam-se sexta (03/07), segunda (06/07) e terça (07/07) — o prazo é
**07/07/2026**.

### Código de rastreio

Toda entrega recebe um código no formato `BRD-2026-XXXXX` no momento do
cadastro. O código é o identificador que o cliente usa para rastrear a carga e,
por isso, **nunca se repete**: duas entregas jamais compartilham o mesmo código,
independentemente de quantas forem cadastradas ou de quão próximas no tempo.

### Validação do cadastro de entrega

| Campo | Regra |
|---|---|
| `id_transportadora` | Obrigatório. A transportadora precisa existir e estar ativa. |
| `destinatario_nome` | Obrigatório. Não pode ser vazio nem conter apenas espaços em branco. |
| `cidade` | Obrigatório. Não pode ser vazio nem conter apenas espaços em branco. |
| `uf` | Obrigatório. Não pode ser vazio nem conter apenas espaços em branco. |
| `peso_kg` | Obrigatório. Precisa ser **maior que zero**. |
| `volumes` | Obrigatório. Número inteiro, **mínimo 1**. |
| `data_coleta` | Opcional. Quando ausente, assume a data de hoje. |

Cadastro que viole qualquer uma dessas regras é recusado com `422` e uma
mensagem explicando o campo. A entrega não é criada.

### Listagem de entregas

- **Busca (`q`)**: procura em código, nome do destinatário e cidade. A busca
  **ignora acentuação e diferenças de maiúsculas/minúsculas** — procurar por
  `sao paulo`, `SÃO PAULO` ou `São Paulo` devolve os mesmos resultados.
- **Paginação**: cada página devolve exatamente `limit` itens (10 por padrão),
  exceto a última, que devolve o que restar.
- **Contador (`total`)**: reflete o resultado do filtro aplicado, e não o
  tamanho total da base. Filtrando por Curitiba, `total` é a quantidade de
  entregas de Curitiba.
- **Entregas canceladas**: ficam **fora** da listagem padrão, por decisão da
  área de operações — o dia a dia acompanha o que está em andamento. Para
  vê-las, marque "incluir canceladas" na tela ou envie
  `incluir_canceladas=true` na API.

### Transportadoras

- A listagem devolve apenas transportadoras **ativas** por padrão. Use
  `incluir_inativas=true` para ver todas.
- Transportadora inativa não aceita novas entregas.
- O **CNPJ é armazenado e exibido sem máscara de formatação**
  (`12345678000195`, e não `12.345.678/0001-95`). Foi decisão do time: o campo
  alimenta integrações que exigem o número puro, e formatar só na tela abriria
  divergência entre o que se vê e o que se envia.

---

## Contrato da API

Todas as respostas são JSON. Erros seguem o formato `{ "erro": "mensagem" }`.

| Método | Rota | Parâmetros | Resposta |
|---|---|---|---|
| `GET` | `/api/entregas` | `q`, `status`, `page` (padrão 1), `limit` (padrão 10), `incluir_canceladas` | `200` — `{ "total": n, "itens": [...] }` |
| `GET` | `/api/entregas/{id}` | — | `200` com a entrega · `404` `{ "erro": ... }` se o id não existir |
| `POST` | `/api/entregas` | corpo JSON com os campos do cadastro | `201` com a entrega criada · `422` se a validação falhar · `404` se a transportadora não existir |
| `PATCH` | `/api/entregas/{id}/status` | `{ "status": "...", "descricao": "..." }` | `200` com a entrega atualizada · `422` se a transição não for permitida · `404` se o id não existir |
| `GET` | `/api/transportadoras` | `incluir_inativas` | `200` — lista de transportadoras |
| `POST` | `/_reset` | — | `200` — `{ "ok": true }` |

### Exemplos

```bash
# Listar a segunda página de entregas em trânsito
curl "http://localhost:3000/api/entregas?status=EM_TRANSITO&page=2&limit=10"

# Consultar uma entrega
curl http://localhost:3000/api/entregas/1

# Cadastrar
curl -X POST http://localhost:3000/api/entregas \
  -H 'Content-Type: application/json' \
  -d '{"id_transportadora":1,"destinatario_nome":"Ana Souza","cidade":"Curitiba","uf":"PR","peso_kg":5,"volumes":1,"data_coleta":"2026-07-02"}'

# Avançar o status
curl -X PATCH http://localhost:3000/api/entregas/1/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"COLETADA","descricao":"Coletado na origem"}'

# Voltar os dados ao estado inicial
curl -X POST http://localhost:3000/_reset
```

---

## Modelo de dados

```jsonc
// transportadora
{
  "id": 1,
  "cnpj": "12345678000195",
  "nome_fantasia": "Trans Sul Logística",
  "prazo_dias": 3,
  "ativa": true
}

// entrega
{
  "id": 1,
  "codigo": "BRD-2026-00001",
  "id_transportadora": 1,
  "destinatario_nome": "Cliente 1",
  "cidade": "Rio de Janeiro",
  "uf": "RJ",
  "status": "COLETADA",
  "peso_kg": 1.7,
  "volumes": 2,
  "data_coleta": "2026-06-02",
  "data_prazo": "2026-07-02",
  "historico": [
    { "status": "CRIADA", "data": "2026-06-02", "descricao": "Entrega registrada" }
  ]
}
```

---

## Estrutura do projeto

```
server.js               roteamento HTTP e arquivos estáticos
src/store.js            estado em memória
src/seed.js             conjunto inicial de dados
src/entregas.js         regras de entrega: listagem, cadastro, status, prazo
src/transportadoras.js  regras de transportadora
public/                 interface web (HTML, CSS e JavaScript)
```
