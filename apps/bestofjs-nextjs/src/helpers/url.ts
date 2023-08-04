// Format a URL to be displayed, removing `http://` and trailing `/`
export default function formatUrl(url: string) {
  const result = url.replace(/\/$/, "").toLowerCase();
  return result.replace(/^https?:\/\/(.*)$/, "$1");
}
