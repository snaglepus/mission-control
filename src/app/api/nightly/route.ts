import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LIST_TTL_MS = 5 * 60 * 1000;
const FILES_TTL_MS = 5 * 60 * 1000;
const CONTENT_TTL_MS = 60 * 60 * 1000;

type CacheEntry<T> = { value: T; expiresAt: number };

let listCache: CacheEntry<unknown> | null = null;
const filesCache = new Map<string, CacheEntry<unknown>>();
const contentCache = new Map<string, CacheEntry<string | null>>();

function getCached<T>(entry: CacheEntry<T> | null | undefined): T | null {
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) return null;
  return entry.value;
}

function setCached<T>(value: T, ttlMs: number): CacheEntry<T> {
  return { value, expiresAt: Date.now() + ttlMs };
}

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
  const refresh = searchParams.get("refresh") === "1";

  // If requesting specific file content
  if (fileId) {
    if (!refresh) {
      const cached = getCached(contentCache.get(fileId));
      if (cached) {
        return NextResponse.json(
          { content: cached },
          {
            headers: {
              "Cache-Control": "private, max-age=300, stale-while-revalidate=3600",
            },
          }
        );
      }
    }

    const content = await gogDriveDownload(fileId);
    contentCache.set(fileId, setCached(content, CONTENT_TTL_MS));

    return NextResponse.json(
      { content },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=3600",
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
    if (!refresh) {
      const cached = getCached(filesCache.get(date));
      if (cached) {
        return NextResponse.json(
          cached,
          {
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
            },
          }
        );
      }
    }

    const folder = sortedFolders.find((f) => f.name === date);
    if (!folder) {
      return NextResponse.json({ files: [], date });
    }
    const files = await gogDriveSearch(`'${folder.id}' in parents`);
    const payload = { files, date, folderId: folder.id };
    filesCache.set(date, setCached(payload, FILES_TTL_MS));

    return NextResponse.json(
      payload,
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }

  if (!refresh) {
    const cached = getCached(listCache);
    if (cached) {
      return NextResponse.json(
        cached,
        {
          headers: {
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }
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

  const payload = { dates: datesWithSummaries };
  listCache = setCached(payload, LIST_TTL_MS);

  // Return all date folders with summaries
  return NextResponse.json(
    payload,
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
