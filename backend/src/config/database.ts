export function getDatabaseUrl(): string {
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
    throw new Error("Database environment variables are not set");
  }

  return `postgresql://${DB_USER}:${DB_PASSWORD ?? ""}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}