import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { NextRequest, NextResponse } from "next/server";

const lambda = new LambdaClient({ region: "ap-northeast-1" });

export async function POST(request: NextRequest) {
  let res: NextResponse<any> = NextResponse.json({
    success: false,
    statusCode: 500,
    payload: {
      msg: "error",
    },
  });
  try {
    const command = new InvokeCommand({
      FunctionName: "xray-lambda",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({}),
    });
    const response = await lambda.send(command);
    // Payloadはuint8arrayなので、JSONに変換
    const decoder = new TextDecoder();
    const responsePayload = JSON.parse(decoder.decode(response.Payload));
    res = NextResponse.json({
      success: true,
      statusCode: response.StatusCode,
      payload: responsePayload,
    });
  } catch (error) {
    console.error("Lambda invoke error:", error);
    res = NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
  return res;
}
