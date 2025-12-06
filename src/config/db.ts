import { Pool } from "pg";
import config from './config';

export const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

pool.connect().then(() => {
    console.log('Connected to PostgreSQL 💽');
}).catch((err) => {
    console.error('Error connecting to database 💩 ', err);
});
