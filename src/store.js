const { seedTransportadoras, seedEntregas } = require('./seed');

let estado = {
  transportadoras: [],
  entregas: [],
};

function reset() {
  estado = {
    transportadoras: seedTransportadoras(),
    entregas: seedEntregas(),
  };
  return estado;
}

function getState() {
  if (!estado.transportadoras.length) {
    reset();
  }
  return estado;
}

module.exports = { reset, getState };
