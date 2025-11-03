import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { NextRequest, NextResponse } from "next/server";
import { trace } from "@opentelemetry/api";
import { request as sendRequest } from "undici";

const lambda = new LambdaClient({ region: "ap-northeast-1" });

export async function POST(request: NextRequest) {
  const res = await sendRequest("http://localhost:3001/api/invoke", {
    method: "POST",
  });
  return NextResponse.json({
    status: res.statusCode,
  });
}
