import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
});

export default pool;
