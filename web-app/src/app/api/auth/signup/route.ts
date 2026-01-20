import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
