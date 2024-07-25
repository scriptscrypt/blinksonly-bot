import { envTelegramBotToken } from "@/lib/envConfig/envConfig";
import { Bot, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Create a mock request object that matches the expected input
    const mockRequest = {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body: body,
    };

    // Create a mock response object
    const mockResponse = {
      status: (statusCode: number) => ({
        end: () => NextResponse.json({ ok: true }, { status: statusCode }),
      }),
    };

    // Call the webhook handler with the mock request and response
    await webhookHandler(mockRequest as any, mockResponse as any);

    // Return the response
    return mockResponse.status(200).end();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
const bot = new Bot(envTelegramBotToken || "");
const webhookHandler = webhookCallback(bot, "next-js");