import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export const client = new SQSClient({
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
  region: "ap-northeast-1",
  logger: console,
});

client
  .send(
    new SendMessageCommand({
      QueueUrl: "http://localhost:9324/queue/test",
      MessageBody: "Hello, world!",
    })
  )
  .catch(console.error);
