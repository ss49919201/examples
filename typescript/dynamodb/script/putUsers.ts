import {
  BatchWriteItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { client } from "./client";

const putUser = async () => {
  await client.send(
    new PutItemCommand({
      TableName: "Users",
      Item: {
        id: { S: "1" },
        name: { S: "Alice" },
      },
    })
  );
};

const putUsers = async () => {
  await client.send(
    new BatchWriteItemCommand({
      RequestItems: {
        Users: [
          {
            id: 1,
            name: "Alice",
          },
          {
            id: 2,
            name: "Bob",
          },
          {
            id: 3,
            name: "Charlie",
          },
        ].map((v) => ({
          PutRequest: {
            Item: {
              id: { S: v.id.toString() },
              name: { S: v.name },
            },
          },
        })),
      },
    })
  );
};

putUsers().catch((e) => console.error(e));
