import { Pool } from "pg";

export const pool = new Pool({
    user: 'user',
    password: 'password',
    host: 'postgres',
    database: 'shortly',
    port: 5432,
});

pool.connect().then(() => {
    console.log('Connected to PostgreSQL 💽');
}).catch((err) => {
    console.error('Error connecting to database 💩 ', err);
});
