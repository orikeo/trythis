import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./src/config/database";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});