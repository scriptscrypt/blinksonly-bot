import { webhookCallback } from "grammy";
import { NextResponse } from "next/server";
import botHandler from "../../../../scripts/bot";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create mock request and response objects
    const mockReq = {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(body),
    };
    const mockRes = {
      setHeader: () => {},
      end: () => {},
    };

    // Call the bot handler
    await botHandler.handleUpdate(mockReq as any, mockRes as any);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error handling update:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Bot webhook is active" });
}
