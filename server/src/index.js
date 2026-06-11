import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';

const bootstrap = async () => {
  const app = createApp();
  const server = http.createServer(app);
  server.listen(env.port, () => {
    console.log(`🚀 Server ready at http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Server failed to start', error);
  process.exit(1);
});

