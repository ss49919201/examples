import { Context } from "aws-lambda";

interface HandlerResponse {
  statusCode: number;
  body: string;
}

export const handler = async (
  event: unknown,
  context: Context,
): Promise<HandlerResponse> => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("Context:", {
    functionName: context.functionName,
    requestId: context.awsRequestId,
    memoryLimitInMB: context.memoryLimitInMB,
  });

  try {
    const response: HandlerResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from Lambda",
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId,
      }),
    };

    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
