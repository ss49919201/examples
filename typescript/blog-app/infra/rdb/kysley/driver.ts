import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import {
  EnvDatabase,
  EnvDatabaseHost,
  EnvDatabasePassword,
  EnvDatabaseUser,
} from "../../../env/value.ts";
import { Database } from "./type.ts";

const dialect = new MysqlDialect({
  pool: async () =>
    createPool({
      database: EnvDatabase(),
      user: EnvDatabaseUser(),
      password: EnvDatabasePassword(),
      host: EnvDatabaseHost(),
    }),
});

export const db = new Kysely<Database>({
  dialect,
});
