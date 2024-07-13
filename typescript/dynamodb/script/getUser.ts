import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { z } from "zod";
import { client } from "./client";

const getUser = async () => {
  const { Item: item } = await client.send(
    new GetItemCommand({
      TableName: "Users",
      Key: {
        id: { S: "1" },
      },
    })
  );
  if (!item) {
    throw new Error("User not found");
  }
  const unmarshalled = unmarshall(item);
  return newUser({
    id: unmarshalled.id,
    name: unmarshalled.name,
  });
};

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
} as const);

type User = z.infer<typeof userSchema>;

const newUser = (user: User) =>
  user ? userSchema.parse(user) : console.error("User not found");

getUser()
  .then((r) => console.log(r))
  .catch((e) => console.error(e));
