export function transformToDirectLink(url: string): string {
  // OneDrive short link (1drv.ms) → force download
  if (url.includes("1drv.ms")) {
    return url + "?download=1";
  }

  // OneDrive long link → force download
  if (url.includes("onedrive.live.com")) {
    const hasParams = url.includes("?");
    return hasParams ? url + "&download=1" : url + "?download=1";
  }

  // Anders: geef gewoon de originele link terug
  return url;
}
