import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { setTimeout } from "timers/promises";

async function listS3() {
  const s3client = new S3Client({
    region: "ap-northeast-1",
  });
  const listed = await s3client.send(new ListBucketsCommand());
  console.log(listed.Buckets);
}

async function invokeLambda() {
  const lambdaClient = new LambdaClient({
    region: "ap-northeast-1",
  });
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: "xray-lambda",
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify({}),
    })
  );
}

async function run() {
  await invokeLambda();
  // await listS3();
  // テレメトリデータのエクスポートを待つ
  await setTimeout(5000);
}

run();
