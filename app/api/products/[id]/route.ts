import { NextResponse } from "next/server";

import { getProductById } from "@/lib/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
