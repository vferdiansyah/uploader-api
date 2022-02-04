import { createServer } from 'http';
import expressApp from './app';
import { app, node } from './configs';

const { port } = app;
const { env } = node;

const log = `API is up and running in ${env} on port ${port}`;

const httpServer = createServer(expressApp);
httpServer.listen(port, () => {
  console.log(log);
});
