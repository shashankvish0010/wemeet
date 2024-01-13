"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const client = new ioredis_1.Redis();
module.exports = client;
