import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://h2vitaldash.x900.3az.de/api";
const API_SECRET = process.env.MANUAL_DELIVERY_API_SECRET || "";

/**
 * Server-side proxy for creating orders.
 * This keeps the Bearer token server-side and avoids CORS issues.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE}/manual-deliveries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Bestellung konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
