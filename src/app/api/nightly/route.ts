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

async function gogDriveSearch(query: string): Promise<DriveFile[]> {
  const { execSync } = await import("child_process");
  try {
    const raw = execSync(
      `gog drive search "${query}" --account rob@robjam.es -j`,
      { encoding: "utf-8", timeout: 15000 }
    );
    const data = JSON.parse(raw);
    return data.files || [];
  } catch {
    return [];
  }
}

async function gogDriveDownload(fileId: string): Promise<string | null> {
  const { execSync } = await import("child_process");
  const { existsSync, readFileSync, unlinkSync } = await import("fs");
  const tmpPath = `/tmp/mc-nightly-${fileId}`;
  try {
    execSync(
      `gog drive download "${fileId}" --out "${tmpPath}" --account rob@robjam.es`,
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

  // Return all date folders
  return NextResponse.json(
    {
      dates: sortedFolders.map((f) => ({
        date: f.name,
        id: f.id,
        modified: f.modifiedTime,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
