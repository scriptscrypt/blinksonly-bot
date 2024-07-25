import { webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import { handleUpdate } from "../../../../scripts/bot";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Create a mock request object
    const mockReq = {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body: body,
    };

    // Create a mock response object
    const mockRes = {
      status: (code: number) => ({
        end: () => {},
        json: (data: any) => {},
      }),
      json: (data: any) => {},
      send: (data: any) => {},
      end: () => {},
    };

    // Call handleUpdate with both mock objects
    await handleUpdate(mockReq as any, mockRes as any);
    
    // Return a success response
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling update:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Bot webhook is active" });
}