import { PrismaClient } from "@prisma/client";
import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { execSync } from "node:child_process";

describe("user", () => {
  jest.setTimeout(60000);

  let mysqlContainer: StartedMySqlContainer;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    mysqlContainer = await new MySqlContainer("mysql:8.0").start();
    console.log(mysqlContainer.getConnectionUri());
    prismaClient = new PrismaClient({
      datasourceUrl: mysqlContainer.getConnectionUri(),
    });
    execSync("npx prisma db push");
  });

  afterAll(async () => {
    await mysqlContainer.stop();
  });

  it("should create and return multiple user", async () => {});
});
