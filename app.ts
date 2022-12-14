import * as express from 'express';
import * as dotenv from 'dotenv';
import * as http from 'http';
import debug from 'debug';

import dependences from './src/dependences';
import middleware from './src/middleware';
import routes from './src/routes';

dotenv.config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const debugLog: debug.IDebugger = debug('app');

// container
middleware(app);
dependences(app);
routes(app);

const runningMessage = `Server running at http://localhost:${port}`;
server.listen(port, () => {
    console.log(runningMessage);
});
