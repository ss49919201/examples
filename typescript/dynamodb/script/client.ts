import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const client = new DynamoDBClient({
  region: "us-west-2",
  endpoint: "http://localhost:18000",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
  logger: console,
});
