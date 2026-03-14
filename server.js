import { createServer } from './app/node_modules/vite/dist/node/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = await createServer({
  root: path.join(__dirname, 'app'),
  server: { port: 5173 },
});
await server.listen();
server.printUrls();
