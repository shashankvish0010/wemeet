"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Local_DB = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const pool = new pg_1.Pool({
    connectionString: process.env.NODE_ENV === "production" ? process.env.PROD_DB_URL : Local_DB
});
module.exports = pool;
