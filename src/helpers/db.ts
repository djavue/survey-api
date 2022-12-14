import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

import { User } from '../entities/User';

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const ormOptions: any = {
    type: 'postgres',
    // url: process.env.DB_URI,
    url: `postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?sslmode=disable`,
    logging: true,
    synchronize: true,
    entities: [
      User,
      // '../entities/**/*.{js,ts}',
      // '../entities/*.{js,ts}',
    ],
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
};

const db = new DataSource(ormOptions);
db.initialize()
  .then(() => console.log(`Data Source has been initialized`))
  .catch((err) => console.error(`Data Source initialization error`, err));

export default db;
