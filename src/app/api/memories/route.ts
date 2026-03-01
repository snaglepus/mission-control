import { NextResponse } from "next/server";
import { loadMemories } from "@/app/lib/memories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await loadMemories();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Memories API error:", error);
    return NextResponse.json(
      { error: "Failed to load memories", memories: [], meta: { total: 0, sourceFiles: [] } },
      { status: 500 }
    );
  }
}
