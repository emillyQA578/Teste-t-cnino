function seedTransportadoras() {
  return [
    { id: 1, cnpj: '12345678000195', nome_fantasia: 'Trans Sul Logística', prazo_dias: 3, ativa: true },
    { id: 2, cnpj: '23456789000184', nome_fantasia: 'Rota Brasil', prazo_dias: 2, ativa: true },
    { id: 3, cnpj: '34567890000173', nome_fantasia: 'Expresso Nordeste', prazo_dias: 5, ativa: true },
    { id: 4, cnpj: '45678901000162', nome_fantasia: 'Logística Centro', prazo_dias: 4, ativa: false },
    { id: 5, cnpj: '56789012000151', nome_fantasia: 'Carga Viva', prazo_dias: 1, ativa: true },
  ];
}

function dataUtil(date) {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function calcularPrazo(dataColeta, prazoDias) {
  const inicio = new Date(`${dataColeta}T12:00:00`);
  let data = new Date(inicio);
  let diasContados = 0;

  while (diasContados < prazoDias) {
    data.setDate(data.getDate() + 1);
    const dia = data.getDay();
    if (dia !== 0 && dia !== 6) {
      diasContados += 1;
    }
  }

  return dataUtil(data);
}

function seedEntregas() {
  const cidades = ['Rio de Janeiro', 'São Paulo', 'Curitiba', 'Belo Horizonte', 'Porto Alegre', 'Salvador', 'Recife'];
  const ufs = ['RJ', 'SP', 'PR', 'MG', 'RS', 'BA', 'PE'];
  const statusPadrao = ['CRIADA', 'COLETADA', 'EM_TRANSITO', 'SAIU_ENTREGA', 'ENTREGUE'];

  return Array.from({ length: 42 }, (_, index) => {
    const id = index + 1;
    const idTransportadora = (index % 5) + 1;
    const status = statusPadrao[index % statusPadrao.length];
    const dataColeta = dataUtil(new Date(2026, 5, 2 + index));
    const prazoDias = (index % 5) + 1;
    const dataPrazo = calcularPrazo(dataColeta, prazoDias);

    return {
      id,
      codigo: `BRD-2026-${String(id).padStart(5, '0')}`,
      id_transportadora: idTransportadora,
      destinatario_nome: `Cliente ${id}`,
      cidade: cidades[index % cidades.length],
      uf: ufs[index % ufs.length],
      status,
      peso_kg: Number((1 + (id % 7) * 0.8).toFixed(2)),
      volumes: (id % 3) + 1,
      data_coleta: dataColeta,
      data_prazo: dataPrazo,
      historico: [
        { status: 'CRIADA', data: dataColeta, descricao: 'Entrega registrada' },
      ],
    };
  });
}

module.exports = { seedTransportadoras, seedEntregas };
