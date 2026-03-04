import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GOG_PATH = "/home/linuxbrew/.linuxbrew/bin/gog";

async function gogDriveDownload(fileId: string): Promise<string | null> {
  const { execFileSync } = await import("child_process");
  const { existsSync, readFileSync, unlinkSync } = await import("fs");
  const tmpPath = `/tmp/mc-nightly-render-${fileId}`;
  try {
    execFileSync(
      GOG_PATH,
      ["drive", "download", fileId, "--out", tmpPath, "--account", "rob@robjam.es"],
      { encoding: "utf-8", timeout: 15000 }
    );
    if (existsSync(tmpPath)) {
      const content = readFileSync(tmpPath, "utf-8");
      unlinkSync(tmpPath);
      return content;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const type = searchParams.get("type") || "html";

  if (!fileId) {
    return NextResponse.json({ error: "fileId required" }, { status: 400 });
  }

  const content = await gogDriveDownload(fileId);
  if (!content) {
    return new NextResponse("Failed to load file", { status: 500 });
  }

  if (type === "html") {
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  // Return raw content for other types
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
