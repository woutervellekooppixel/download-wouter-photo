// lib/microsoftGraph.ts
import qs from "querystring";
import axios from "axios";

const TENANT_ID = process.env.MS_GRAPH_TENANT_ID!;
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID!;
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.MS_GRAPH_REFRESH_TOKEN!; // komt later

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedAccessToken && now < tokenExpiry - 60000) {
    return cachedAccessToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const body = qs.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await axios.post(tokenUrl, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  cachedAccessToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;

  return cachedAccessToken;
}

export async function listOneDriveFolder(folderPath: string = "/Downloads"): Promise<any[]> {
  const token = await getAccessToken();

  const encodedPath = encodeURIComponent(folderPath);
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root:${encodedPath}:/children`;

  const response = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.value;
}