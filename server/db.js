require("dotenv").config();
const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema = require("./schema");

const client = postgres(process.env.DATABASE_URL, {
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("sslmode=require") ? "require" : false,
});

const db = drizzle(client, { schema });

module.exports = db;
