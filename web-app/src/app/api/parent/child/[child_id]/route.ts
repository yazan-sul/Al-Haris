import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ child_id: string }> },
) {
  try {
    const resolvedParams = await params;
    const childId = resolvedParams.child_id;

    console.log("تم استلام المعرف بنجاح:", childId);

    if (!childId || childId === "undefined") {
      return NextResponse.json(
        { error: "معرف الطفل غير موجود في الرابط" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      `https://al-haris-production.up.railway.app/parent/child/${childId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" },
      { status: 500 },
    );
  }
}
