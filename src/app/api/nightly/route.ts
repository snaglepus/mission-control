import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";

// Root OLIVIA/Nightly folder on Drive
const NIGHTLY_FOLDER_ID = "1lhYbFFayaai64XSEqu_MAVVq0R1J0zsE";

async function getAccessToken(): Promise<string | null> {
  const { execSync } = await import("child_process");
  try {
    return execSync("gog auth token --account rob@robjam.es", {
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

async function listFolder(
  folderId: string,
  token: string
): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent(
    "files(id,name,mimeType,modifiedTime,size,webViewLink)"
  );
  const res = await fetch(
    `${GOOGLE_DRIVE_API}/files?q=${q}&fields=${fields}&orderBy=name desc&pageSize=100`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.files || [];
}

async function getFileContent(
  fileId: string,
  token: string
): Promise<string | null> {
  // Try export as text first (for Google Docs), then raw download
  const res = await fetch(
    `${GOOGLE_DRIVE_API}/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return res.text();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const fileId = searchParams.get("fileId");

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }

  // If requesting specific file content
  if (fileId) {
    const content = await getFileContent(fileId, token);
    return NextResponse.json(
      { content },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // List date folders
  const dateFolders = await listFolder(NIGHTLY_FOLDER_ID, token);
  const folders = dateFolders
    .filter((f) => f.mimeType === "application/vnd.google-apps.folder")
    .sort((a, b) => b.name.localeCompare(a.name));

  // If requesting specific date's files
  if (date) {
    const folder = folders.find((f) => f.name === date);
    if (!folder) {
      return NextResponse.json({ files: [], date });
    }
    const files = await listFolder(folder.id, token);
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
      dates: folders.map((f) => ({
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
