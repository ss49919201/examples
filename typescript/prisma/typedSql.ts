import { PrismaClient } from "@prisma/client";
import { findAndCountUser } from "@prisma/client/sql";

const prisma = new PrismaClient();
prisma.$queryRawTyped(findAndCountUser("foo")).then((result) => {
  console.log(
    result.map((row) => {
      row.name;
      row["counted_id"];
    })
  );
});
