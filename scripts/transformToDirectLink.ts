// utils/transformToDirectLink.ts

export function transformToDirectLink(url: string): string {
  try {
    if (!url.startsWith("http")) return url;

    const parsed = new URL(url);
    const shareId = parsed.pathname.split("/").pop();

    if (!shareId) return url;

    return `https://woutervellekoopnl-my.sharepoint.com/personal/info_woutervellekoop_nl/_layouts/15/download.aspx?share=${shareId}`;
  } catch (err) {
    console.error("❌ Ongeldige URL:", url);
    return url;
  }
}