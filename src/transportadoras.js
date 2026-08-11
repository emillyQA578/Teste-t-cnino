const { getState } = require('./store');

function listar({ incluir_inativas = false } = {}) {
  const { transportadoras } = getState();
  return incluir_inativas ? transportadoras : transportadoras.filter((t) => t.ativa);
}

module.exports = { listar };
