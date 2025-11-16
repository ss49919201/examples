import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { setTimeout } from "timers/promises";

async function run() {
  const s3 = new S3Client({
    region: "ap-northeast-1",
  });
  const listed = await s3.send(new ListBucketsCommand());
  console.log(listed.Buckets);

  // テレメトリデータのエクスポートを待つ
  await setTimeout(5000);
}

run();
