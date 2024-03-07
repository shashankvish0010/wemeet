"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const client = new ioredis_1.Redis('rediss://red-cn74mricn0vc738smbl0:NkKo1Cj90zuRDn7KgQb6FB2faBtc7GER@oregon-redis.render.com:6379');
module.exports = client;
