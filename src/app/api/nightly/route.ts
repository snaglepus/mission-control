import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Root OLIVIA/Nightly folder on Drive
const NIGHTLY_FOLDER_ID = "1lhYbFFayaai64XSEqu_MAVVq0R1J0zsE";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

const GOG_PATH = "/home/linuxbrew/.linuxbrew/bin/gog";

async function gogDriveSearch(query: string): Promise<DriveFile[]> {
  const { execFileSync } = await import("child_process");
  try {
    const raw = execFileSync(
      GOG_PATH,
      ["drive", "search", query, "--account", "rob@robjam.es", "-j"],
      { encoding: "utf-8", timeout: 15000 }
    );
    const data = JSON.parse(raw);
    return data.files || [];
  } catch (err) {
    console.error("gogDriveSearch error:", err);
    return [];
  }
}

async function gogDriveDownload(fileId: string): Promise<string | null> {
  const { execFileSync } = await import("child_process");
  const { existsSync, readFileSync, unlinkSync } = await import("fs");
  const tmpPath = `/tmp/mc-nightly-${fileId}`;
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
  const date = searchParams.get("date");
  const fileId = searchParams.get("fileId");

  // If requesting specific file content
  if (fileId) {
    const content = await gogDriveDownload(fileId);
    return NextResponse.json(
      { content },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // List date folders in Nightly
  const folders = await gogDriveSearch(
    `'${NIGHTLY_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`
  );
  const sortedFolders = folders.sort((a, b) => b.name.localeCompare(a.name));

  // If requesting specific date's files
  if (date) {
    const folder = sortedFolders.find((f) => f.name === date);
    if (!folder) {
      return NextResponse.json({ files: [], date });
    }
    const files = await gogDriveSearch(`'${folder.id}' in parents`);
    return NextResponse.json(
      { files, date, folderId: folder.id },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // For each date folder, fetch files and build summary
  const datesWithSummaries = await Promise.all(
    sortedFolders.map(async (f) => {
      const files = await gogDriveSearch(`'${f.id}' in parents`);
      const fileNames = files
        .map((file) => file.name)
        .filter((name) => name !== "index.html" && name !== "SUMMARY.md");

      // Try to load SUMMARY.md if it exists
      const summaryFile = files.find((file) => file.name === "SUMMARY.md");
      let summary = "";
      if (summaryFile) {
        const content = await gogDriveDownload(summaryFile.id);
        if (content) {
          // Extract first few lines as summary (skip title)
          const lines = content
            .split("\n")
            .filter((l) => l.trim() && !l.startsWith("#"))
            .slice(0, 5)
            .join(" ")
            .substring(0, 300);
          summary = lines;
        }
      }

      // Build auto-summary from file names if no SUMMARY.md
      if (!summary && fileNames.length > 0) {
        summary = fileNames
          .map((name) =>
            name
              .replace(/\.md$/, "")
              .replace(/\.html$/, "")
              .replace(/-/g, " ")
          )
          .join(" • ");
      }

      return {
        date: f.name,
        id: f.id,
        modified: f.modifiedTime,
        fileCount: files.filter((file) => file.name !== "SUMMARY.md").length,
        summary,
        files: fileNames,
      };
    })
  );

  // Return all date folders with summaries
  return NextResponse.json(
    { dates: datesWithSummaries },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
