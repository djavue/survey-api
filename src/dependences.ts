import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as expressSession from 'express-session';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
// import { createConnection } from 'typeorm';
import { pagination } from 'typeorm-pagination';

import db from './helpers/db';
db

dotenv.config();

export default (app: express.Application): void => {
  const isProd: boolean = (app.get('env') === 'production');
  const isDebug: boolean = !!(process.env.DEBUG || false);

  const bodyOptions: any = {
    extended: false,
    type: 'application/x-www-form-urlencoded',
    limit: '10mb',
  };

  const sessOptions: any = {
    secret: 'SURVEY_s3cr3t',
    name: 'SURVEY-api-sess',
    resave: false,
    saveUninitialized: true,
    rolling: false,
    cookie: { secure: isProd, maxAge: 1000 * 60 * 2 }
  };

  const corsOptions: any = {
    // origin: [],
    exposedHeader: 'x-token',
    optionsSuccessStatus: 200,
  };

  const loggerOptions: expressWinston.LoggerOptions = {
    meta: !isDebug,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
  };

  app.use(compression());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded(bodyOptions));
  app.use(expressSession(sessOptions));
  app.use(cors(corsOptions));
  app.use(expressWinston.logger(loggerOptions));
  app.use(pagination);
  // createConnection()
  //   .then(async () => {
  //     const PORT = process.env.DB_PORT || 5432;
  //     app.listen(PORT, () => {
  //       console.log(`CONNECTED TO DB AND SERVER START ON ${PORT}`);
  //     });
  //   })
  // .catch((error) => console.log(error));
}
