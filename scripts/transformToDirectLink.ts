export function transformToDirectLink(url?: string): string {
  if (!url) return "";

  // OneDrive short link
  if (url.includes("1drv.ms")) {
    return url + "?download=1";
  }

  // OneDrive long link
  if (url.includes("onedrive.live.com")) {
    const hasParams = url.includes("?");
    return hasParams ? url + "&download=1" : url + "?download=1";
  }

  // SharePoint link
  if (url.includes("sharepoint.com")) {
    const hasParams = url.includes("?");
    return hasParams ? url + "&download=1" : url + "?download=1";
  }

  return url;
}
