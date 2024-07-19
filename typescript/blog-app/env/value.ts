export function EnvDatabase() {
  const value = process.env.DATABASE;
  return value ?? "kysely_example";
}

export function EnvDatabaseUser() {
  const value = process.env.DATABASE_USER;
  return value ?? "root";
}

export function EnvDatabasePassword() {
  const value = process.env.DATABASE_PASSWORD;
  return value ?? "password";
}

export function EnvDatabaseHost() {
  const value = process.env.DATABASE_HOST;
  return value ?? "localhost";
}
