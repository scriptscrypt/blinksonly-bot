import { Bot, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "");

bot.command("ask-sol-amount", async (ctx) => {
  await ctx.reply("Please enter the SOL amount:");
});

bot.on("message", async (ctx) => {
  if (ctx.message.text && !ctx.message.text.startsWith("/")) {
    const solAmount = parseFloat(ctx.message.text);
    if (isNaN(solAmount)) {
      await ctx.reply("Invalid input. Please enter a valid number.");
    } else {
      await ctx.reply(`Received SOL amount: ${solAmount}`);
    }
  }
});

const webhookHandler = webhookCallback(bot, "next-js");

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