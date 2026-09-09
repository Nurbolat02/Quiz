require("dotenv").config();
const { defineConfig } = require("drizzle-kit");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env");
}

module.exports = defineConfig({
    schema: "./schema.js",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    strict: true,
});
