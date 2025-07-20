// lib/microsoftGraph.ts
import qs from "querystring";
import axios from "axios";

const TENANT_ID = process.env.MS_GRAPH_TENANT_ID!;
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID!;
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET!;
const DRIVE_ID = process.env.MS_GRAPH_DRIVE_ID!;

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiry - 60000) return cachedAccessToken;

  const body = qs.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const response = await axios.post(tokenUrl, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  cachedAccessToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;
  return cachedAccessToken;
}

// ✅ Nieuwe functie
export async function getZipsWithHeroFromOneDrive(): Promise<
  { name: string; slug: string; zipUrl: string; heroUrl: string | null }[]
> {
  const token = await getAccessToken();
  const folderPath = encodeURIComponent("/002 Werkmappen/04 Client folder");
  const endpoint = `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/root:${folderPath}:/children`;

  const response = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const items = response.data.value;

  // Filter op ZIP-bestanden
  const zips = items.filter((item: any) => item.name.endsWith(".zip"));

  const result = zips.map((zip: any) => {
    const slug = zip.name.split(".zip")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const heroName = "hero.jpg";

    const folderItems = items.filter(
      (item: any) =>
        item.name === heroName &&
        item.parentReference?.id === zip.parentReference?.id
    );

    const hero = folderItems.length > 0 ? folderItems[0] : null;

    return {
      name: zip.name,
      slug,
      zipUrl: zip["@microsoft.graph.downloadUrl"],
      heroUrl: hero ? hero["@microsoft.graph.downloadUrl"] : null,
    };
  });

  return result;
}