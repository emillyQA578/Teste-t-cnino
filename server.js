const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { reset } = require('./src/store.js');
const { listar, buscar, criar, atualizarStatus } = require('./src/entregas.js');
const { listar: listarTransportadoras } = require('./src/transportadoras.js');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let dados = '';
    req.on('data', (parte) => { dados += parte; });
    req.on('end', () => {
      try { resolve(dados ? JSON.parse(dados) : {}); } catch { resolve({}); }
    });
  });
}

function servirEstatico(res, url) {
  const arquivo = url === '/' ? '/index.html' : url;
  const destino = path.join(__dirname, 'public', arquivo);
  if (!destino.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(destino)) {
    res.writeHead(404); res.end('Não encontrado'); return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(destino)] || 'text/plain' });
  res.end(fs.readFileSync(destino));
}

async function rotear(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const rota = url.pathname;

  if (req.method === 'POST' && rota === '/_reset') { reset(); return json(res, 200, { ok: true }); }
  if (req.method === 'GET' && rota === '/api/transportadoras') {
    return json(res, 200, listarTransportadoras({
      incluir_inativas: url.searchParams.get('incluir_inativas') === 'true',
    }));
  }
  if (req.method === 'GET' && rota === '/api/entregas') {
    return json(res, 200, listar({
      q: url.searchParams.get('q'),
      status: url.searchParams.get('status'),
      page: url.searchParams.get('page') || 1,
      limit: url.searchParams.get('limit') || 10,
      incluir_canceladas: url.searchParams.get('incluir_canceladas') === 'true',
    }));
  }
  if (req.method === 'POST' && rota === '/api/entregas') {
    const corpo = await lerCorpo(req);
    const resultado = criar(corpo);
    return json(res, resultado.status, resultado.corpo);
  }

  const detalhe = rota.match(/^\/api\/entregas\/(\d+)$/);
  if (req.method === 'GET' && detalhe) {
    return json(res, 200, buscar(detalhe[1]) || {});
  }

  const statusRota = rota.match(/^\/api\/entregas\/(\d+)\/status$/);
  if (req.method === 'PATCH' && statusRota) {
    const corpo = await lerCorpo(req);
    const resultado = atualizarStatus(statusRota[1], corpo);
    return json(res, resultado.status, resultado.corpo);
  }

  if (req.method === 'GET') return servirEstatico(res, rota);
  return json(res, 404, { erro: 'Rota não encontrada' });
}

function createServer(port = 3000) {
  const servidor = http.createServer((req, res) => {
    rotear(req, res).catch(() => json(res, 500, { erro: 'Erro interno' }));
  });
  servidor.listen(port);
  return servidor;
}

if (require.main === module) {
  const porta = Number(process.env.PORT || 3000);
  createServer(porta);
  console.log(`TMS Lite rodando em http://localhost:${porta}`);
}

module.exports = { createServer, lerCorpo, json };
