import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://h2vitaldash.x900.3az.de/api";
const API_SECRET = process.env.MANUAL_DELIVERY_API_SECRET || "eOIDM84Be3CmeuXqP/UWt272tBEufy+YnqVXXNHRbpk=";

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
        "Accept": "application/json",
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Order proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bestellung konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
