import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const Local_DB = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const pool = new Pool({
    connectionString : process.env.NODE_ENV === "production" ? process.env.PROD_DB_URL : Local_DB
})

module.exports = pool;