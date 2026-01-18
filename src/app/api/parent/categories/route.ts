import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();

    console.log("Body:", body);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      "https://al-haris-production.up.railway.app/parent/categories",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
