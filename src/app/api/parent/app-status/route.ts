import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/parent/parent/app-status`;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
