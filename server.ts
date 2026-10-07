import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import checkHandler from './api/check.js';
import pdfHandler from './api/pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware para adaptar controladores de Vercel Serverless (req, res) en Express
  app.all('/api/check', async (req, res) => {
    try {
      await checkHandler(req, res);
    } catch (err) {
      console.error('Express /api/check error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error in check' });
      }
    }
  });

  app.all('/api/pdf', async (req, res) => {
    try {
      await pdfHandler(req, res);
    } catch (err) {
      console.error('Express /api/pdf error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error in pdf' });
      }
    }
  });

  // En desarrollo, montar Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // En producción local
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cartas Mágicas Server] Corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
