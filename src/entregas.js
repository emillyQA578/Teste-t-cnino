const { getState } = require('./store');

const FLUXO_STATUS = {
  CRIADA: ['COLETADA'],
  COLETADA: ['EM_TRANSITO'],
  EM_TRANSITO: ['SAIU_ENTREGA'],
  SAIU_ENTREGA: ['ENTREGUE', 'DEVOLVIDA'],
  ENTREGUE: [],
  DEVOLVIDA: [],
  CANCELADA: [],
};

function removerAcentos(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hojeISO() {
  const agora = new Date();
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function dataUtil(dateString) {
  const data = new Date(`${dateString}T12:00:00`);
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
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

  return dataUtil(data.toISOString().slice(0, 10));
}

function encontrarTransportadora(idTransportadora) {
  const { transportadoras } = getState();
  return transportadoras.find((t) => t.id === Number(idTransportadora));
}

function listar({ q, status, page = 1, limit = 10, incluir_canceladas = false } = {}) {
  const { entregas } = getState();
  let resultado = entregas.filter((entrega) => {
    if (!incluir_canceladas && entrega.status === 'CANCELADA') return false;
    if (status && entrega.status !== status) return false;
    if (!q) return true;
    const termo = removerAcentos(q);
    const campos = [entrega.codigo, entrega.destinatario_nome, entrega.cidade].join(' ');
    return removerAcentos(campos).includes(termo);
  });

  const total = resultado.length;
  const pagina = Number(page) || 1;
  const limite = Number(limit) || 10;
  const offset = (pagina - 1) * limite;
  const itens = resultado.slice(offset, offset + limite);

  return { total, itens };
}

function buscar(id) {
  const { entregas } = getState();
  return entregas.find((entrega) => entrega.id === Number(id));
}

function validarEntrega(corpo) {
  const erros = [];

  if (!corpo.id_transportadora) erros.push('id_transportadora é obrigatório');
  if (!corpo.destinatario_nome || !String(corpo.destinatario_nome).trim()) erros.push('destinatario_nome é obrigatório');
  if (!corpo.cidade || !String(corpo.cidade).trim()) erros.push('cidade é obrigatório');
  if (!corpo.uf || !String(corpo.uf).trim()) erros.push('uf é obrigatório');
  if (corpo.peso_kg === undefined || Number(corpo.peso_kg) <= 0) erros.push('peso_kg deve ser maior que zero');
  if (corpo.volumes === undefined || Number(corpo.volumes) < 1 || !Number.isInteger(Number(corpo.volumes))) erros.push('volumes deve ser um número inteiro mínimo 1');

  const transportadora = encontrarTransportadora(corpo.id_transportadora);
  if (!transportadora) {
    erros.push('transportadora não encontrada');
  } else if (!transportadora.ativa) {
    erros.push('transportadora inativa');
  }

  return { erros, transportadora };
}

function criar(corpo = {}) {
  const { erros, transportadora } = validarEntrega(corpo);
  if (erros.length) {
    return { status: 422, corpo: { erro: erros.join('; ') } };
  }

  const { entregas } = getState();
  const id = entregas.length ? Math.max(...entregas.map((e) => e.id)) + 1 : 1;
  const dataColeta = corpo.data_coleta || hojeISO();
  const prazoDias = Number(transportadora.prazo_dias || 1);
  const dataPrazo = calcularPrazo(dataColeta, prazoDias);
  const entrega = {
    id,
    codigo: `BRD-2026-${String(id).padStart(5, '0')}`,
    id_transportadora: Number(corpo.id_transportadora),
    destinatario_nome: String(corpo.destinatario_nome).trim(),
    cidade: String(corpo.cidade).trim(),
    uf: String(corpo.uf).trim(),
    status: 'CRIADA',
    peso_kg: Number(corpo.peso_kg),
    volumes: Number(corpo.volumes),
    data_coleta: dataColeta,
    data_prazo: dataPrazo,
    historico: [
      { status: 'CRIADA', data: dataColeta, descricao: 'Entrega registrada' },
    ],
  };

  entregas.push(entrega);
  return { status: 201, corpo: entrega };
}

function atualizarStatus(id, corpo = {}) {
  const { entregas } = getState();
  const entrega = entregas.find((item) => item.id === Number(id));
  if (!entrega) {
    return { status: 404, corpo: { erro: 'Entrega não encontrada' } };
  }

  const proximoStatus = corpo.status;
  const statusAtual = entrega.status;

  if (!proximoStatus) {
    return { status: 422, corpo: { erro: 'status é obrigatório' } };
  }

  if (statusAtual === 'CANCELADA' || statusAtual === 'ENTREGUE' || statusAtual === 'DEVOLVIDA') {
    return { status: 422, corpo: { erro: 'Transição não permitida para status final' } };
  }

  if (proximoStatus === 'CANCELADA') {
    if (statusAtual !== 'CRIADA' && statusAtual !== 'COLETADA') {
      return { status: 422, corpo: { erro: 'Cancelamento permitido apenas em CRIADA ou COLETADA' } };
    }
    entrega.status = 'CANCELADA';
    entrega.historico.push({ status: 'CANCELADA', data: hojeISO(), descricao: corpo.descricao || 'Entrega cancelada' });
    return { status: 200, corpo: entrega };
  }

  const seguintes = FLUXO_STATUS[statusAtual] || [];
  if (!seguintes.includes(proximoStatus)) {
    return { status: 422, corpo: { erro: 'Transição fora do fluxo permitido' } };
  }

  entrega.status = proximoStatus;
  entrega.historico.push({ status: proximoStatus, data: hojeISO(), descricao: corpo.descricao || 'Status atualizado' });

  return { status: 200, corpo: entrega };
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizarStatus,
  calcularPrazo,
  removerAcentos,
};
