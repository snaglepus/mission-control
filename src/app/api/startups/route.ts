import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GOG_PATH = "/home/linuxbrew/.linuxbrew/bin/gog";
const ACCOUNT = "rob@robjam.es";
const TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = { value: T; expiresAt: number };
let cache: CacheEntry<unknown> | null = null;

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

function isArtifact(file: DriveFile): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".md") || n.endsWith(".markdown") || n.endsWith(".html") || n.endsWith(".htm");
}

async function gogSearch(query: string): Promise<DriveFile[]> {
  const { execFileSync } = await import("child_process");
  try {
    const raw = execFileSync(
      GOG_PATH,
      ["drive", "search", query, "--account", ACCOUNT, "-j"],
      { encoding: "utf-8", timeout: 15000 }
    );
    const data = JSON.parse(raw);
    return data.files || [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "1";

  if (!refresh && cache && cache.expiresAt > Date.now()) {
    return NextResponse.json(cache.value, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" },
    });
  }

  // Folders
  const TABLEBOOKED_FOLDER = "1isMTzJsY86j8ASYLSvIFS-ai_Jp0HB68";
  const CYBERCHAOS_FOLDER = "1LKOxDiBCUqPqrX2Q2WYrM7rE6ht2y594";
  const RESEARCH_FOLDER = "1CgPhZ3ASUQFjRFWosVUm5aKTf5sj_CIW";

  const [tablebookedRaw, cyberRaw, researchRaw, itfmNightlyRaw, shannonNightlyRaw] = await Promise.all([
    gogSearch(`'${TABLEBOOKED_FOLDER}' in parents`),
    gogSearch(`'${CYBERCHAOS_FOLDER}' in parents`),
    gogSearch(`'${RESEARCH_FOLDER}' in parents`),
    gogSearch("name contains 'ITFM-MVP-'"),
    gogSearch("name contains 'Shannon-RedTeam-MVP-'"),
  ]);

  const tablebooked = tablebookedRaw.filter(isArtifact);
  const cyberchaos = [...cyberRaw, ...shannonNightlyRaw]
    .filter(isArtifact)
    .filter((f, idx, arr) => arr.findIndex((x) => x.id === f.id) === idx);

  const itfm = [...researchRaw.filter((f) => /itfm|tbm/i.test(f.name)), ...itfmNightlyRaw]
    .filter(isArtifact)
    .filter((f, idx, arr) => arr.findIndex((x) => x.id === f.id) === idx);

  const payload = {
    startups: {
      tablebooked,
      cyberchaos,
      itfm,
    },
  };

  cache = { value: payload, expiresAt: Date.now() + TTL_MS };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" },
  });
}
