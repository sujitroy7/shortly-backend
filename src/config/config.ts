import dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dbHost: string;
    dbPort: number;
    dbName: string;
    dbUser: string;
    dbPassword: string;
}

const config: Config = {
    port: parseInt(process.env.PORT || "3000"),
    nodeEnv: process.env.NODE_ENV || "development",
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: parseInt(process.env.DB_PORT || "5432"),
    dbName: process.env.DB_NAME || "shortly",
    dbUser: process.env.DB_USER || "sujit",
    dbPassword: process.env.DB_PASSWORD || "password",
}

export default config