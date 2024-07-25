import { webhookCallback } from "grammy";
import { NextResponse } from "next/server";
import { handleUpdate } from "../../../../scripts/bot";

export async function POST(request: Request) {
  try {
    // Grammy's webhookCallback expects a specific request structure
    const adapatedRequest = {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(), // Grammy expects the raw body
    };

    // Grammy's webhookCallback also expects a response object
    const adapatedResponse = {
      status: (code: number) => ({
        json: (body: any) => NextResponse.json(body, { status: code }),
      }),
    };

    // @ts-ignore - Ignore type mismatch for now
    const response = await handleUpdate(adapatedRequest, adapatedResponse);
    
    // @ts-ignore - Ignore type mismatch for now
    return response  || NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error handling update:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Bot webhook is active" });
}
