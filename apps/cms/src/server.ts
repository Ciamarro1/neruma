import http from 'node:http';
import { getPayload } from 'payload';
import config from './payload.config.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

async function ensureDatabaseSchema(payload: any) {
  try {
    const checkResult = await payload.db.execute({
      drizzle: payload.db.drizzle,
      raw: `SELECT count(*) as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collections';`,
    });
    const count = parseInt(checkResult.rows?.[0]?.count || '0', 10);
    if (count > 0) {
      console.log('[Payload CMS] Tabelas do banco de dados já existem. Inicialização concluída.');
      return;
    }

    console.log('[Payload CMS] Banco de dados vazio detectado. Gerando e aplicando DDL schema inicial...');
    const { generateDrizzleJson, generateMigration } = payload.db.requireDrizzleKit();
    const after = await generateDrizzleJson(payload.db.schema);
    const statements = await generateMigration(payload.db.defaultDrizzleSnapshot, after);
    console.log(`[Payload CMS] Aplicando ${statements.length} instruções SQL para criar tabelas e relacionamentos...`);

    let applied = 0;
    for (const stmt of statements) {
      try {
        await payload.db.execute({ drizzle: payload.db.drizzle, raw: stmt });
        applied++;
      } catch (err: any) {
        const msg = err.message || '';
        if (!msg.includes('already exists') && !msg.includes('já existe')) {
          console.warn('[Payload CMS] Aviso ao executar instrução DDL:', msg);
        }
      }
    }
    console.log(`[Payload CMS] Schema PostgreSQL inicial criado com sucesso (${applied} instruções executadas)!`);
  } catch (err: any) {
    console.error('[Payload CMS] Falha ao verificar/aplicar schema do banco:', err);
  }
}

async function start() {
  console.log('[Payload CMS] Inicializando engine editorial...');
  let payload: any;
  try {
    payload = await getPayload({ config });
    console.log('[Payload CMS] Conectado ao banco de dados com sucesso.');
    await ensureDatabaseSchema(payload);
  } catch (err: any) {
    console.error('[Payload CMS] Erro crítico ao inicializar conexão com o banco:', err.message);
    throw err;
  }

  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Health check endpoint
    if (pathname === '/health' || pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'neruma-cms' }));
      return;
    }

    try {
      // 1. Globals: /api/globals/:slug
      const globalMatch = pathname.match(/^\/api\/globals\/([a-zA-Z0-9_-]+)$/);
      if (globalMatch) {
        const slug = globalMatch[1];
        if (req.method === 'GET') {
          try {
            const depth = parseInt(url.searchParams.get('depth') || '2', 10);
            const result = await payload.findGlobal({ slug, depth });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
            return;
          } catch (globalErr: any) {
            if (globalErr.message?.includes('does not exist') || globalErr.message?.includes('relation')) {
              console.warn(`[Payload CMS] Global "${slug}" tabela não existe ou vazia:`, globalErr.message);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({}));
              return;
            }
            throw globalErr;
          }
        }
        if (req.method === 'POST') {
          const body = await parseJsonBody(req);
          const result = await payload.updateGlobal({ slug, data: body });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }
      }

      // 2. Collections: /api/:collection or /api/:collection/:id
      const collectionMatch = pathname.match(/^\/api\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?$/);
      if (collectionMatch) {
        const collection = collectionMatch[1];
        const id = collectionMatch[2];

        if (req.method === 'GET') {
          if (id) {
            try {
              const depth = parseInt(url.searchParams.get('depth') || '2', 10);
              const result = await payload.findByID({ collection, id, depth });
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
              return;
            } catch (findErr: any) {
              if (findErr.message?.includes('not exist') || findErr.message?.includes('not found') || findErr.status === 404) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Documento ${id} não encontrado na coleção ${collection}` }));
                return;
              }
              throw findErr;
            }
          } else {
            try {
              const limit = parseInt(url.searchParams.get('limit') || '10', 10);
              const page = parseInt(url.searchParams.get('page') || '1', 10);
              const depth = parseInt(url.searchParams.get('depth') || '2', 10);

              const where: Record<string, any> = {};
              for (const [key, value] of url.searchParams.entries()) {
                const whereMatch = key.match(/^where\[([a-zA-Z0-9_.]+)\]\[([a-zA-Z0-9_]+)\]$/);
                if (whereMatch) {
                  const field = whereMatch[1];
                  const operator = whereMatch[2];
                  if (!where[field]) where[field] = {};
                  where[field][operator] = value;
                }
              }

              const options: any = { collection, limit, page, depth };
              if (Object.keys(where).length > 0) {
                options.where = where;
              }

              const result = await payload.find(options);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
              return;
            } catch (findErr: any) {
              if (findErr.message?.includes('does not exist') || findErr.message?.includes('relation')) {
                console.warn(`[Payload CMS] Coleção "${collection}" tabela não existe ou vazia:`, findErr.message);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ docs: [], totalDocs: 0, limit: 10, totalPages: 1, page: 1, hasPrevPage: false, hasNextPage: false }));
                return;
              }
              throw findErr;
            }
          }
        }

        if (req.method === 'POST') {
          const body = await parseJsonBody(req);
          const result = await payload.create({ collection, data: body });
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        if (req.method === 'PATCH' && id) {
          const body = await parseJsonBody(req);
          const result = await payload.update({ collection, id, data: body });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        if (req.method === 'DELETE' && id) {
          const result = await payload.delete({ collection, id });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }
      }

      // Root info
      if (pathname === '/' || pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          service: 'Neruma Payload CMS 3.0 API',
          version: '3.0.0',
          endpoints: [
            '/health',
            '/api/stories',
            '/api/lookbooks',
            '/api/collections',
            '/api/rooms',
            '/api/guides',
            '/api/media',
            '/api/globals/site-settings',
            '/api/globals/navigation',
            '/api/globals/seo'
          ]
        }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint não encontrado', pathname }));
    } catch (err: any) {
      console.error(`[Payload CMS] Erro processando ${req.method} ${pathname}:`, err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Erro interno do servidor' }));
    }
  });

  server.listen(PORT, HOST, () => {
    console.log(`[Payload CMS] Servidor REST ouvindo em http://${HOST}:${PORT}`);
  });
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('JSON inválido no corpo da requisição'));
      }
    });
    req.on('error', reject);
  });
}

start().catch(err => {
  console.error('[Payload CMS] Falha ao iniciar:', err);
  process.exit(1);
});
