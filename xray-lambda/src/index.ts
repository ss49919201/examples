import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "ap-northeast-1" });

const handler = async (event: any) => {
  console.log(event);

  const command = new ListObjectsCommand({
    Bucket: "keeput-local",
    Delimiter: "/",
  });
  try {
    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    throw error;
  }
};
module.exports = { handler };
