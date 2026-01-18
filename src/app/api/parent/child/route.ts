import { NextResponse } from "next/server";

const API_BASE_URL = "https://al-haris-production.up.railway.app";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/parent/child`, {
      method: "POST",

      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
