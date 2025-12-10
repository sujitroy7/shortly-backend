import * as cheerio from "cheerio";

export interface OgMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

const DEFAULT_TIMEOUT = 5000; // 5 seconds

/**
 * Fetch Open Graph metadata from a URL
 * @param url - The destination URL to fetch metadata from
 * @returns OgMetadata object with extracted properties
 */
export async function fetchOgMetadata(url: string): Promise<OgMetadata> {
  const defaultMetadata: OgMetadata = {
    title: "",
    description: "",
    image: "",
    url: url,
    siteName: "",
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ShortlyBot/1.0; +https://shortly.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return defaultMetadata;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract OG metadata with fallbacks
    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      "";

    const ogDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    const ogUrl = $('meta[property="og:url"]').attr("content") || url;

    const ogSiteName = $('meta[property="og:site_name"]').attr("content") || "";

    return {
      title: ogTitle.trim(),
      description: ogDescription.trim(),
      image: ogImage.trim(),
      url: ogUrl.trim(),
      siteName: ogSiteName.trim(),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`Timeout fetching OG metadata from ${url}`);
    } else {
      console.error(`Error fetching OG metadata from ${url}:`, error);
    }
    return defaultMetadata;
  }
}

/**
 * Generate HTML page with OG meta tags for social media preview
 * @param metadata - The OG metadata to embed
 * @param destinationUrl - The final redirect destination
 * @returns HTML string with OG tags and auto-redirect
 */
export function generateOgHtml(
  metadata: OgMetadata,
  destinationUrl: string
): string {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const title = escapeHtml(metadata.title || "Redirecting...");
  const description = escapeHtml(metadata.description);
  const image = escapeHtml(metadata.image);
  const url = escapeHtml(metadata.url);
  const siteName = escapeHtml(metadata.siteName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  ${
    description
      ? `<meta property="og:description" content="${description}">`
      : ""
  }
  ${image ? `<meta property="og:image" content="${image}">` : ""}
  <meta property="og:url" content="${url}">
  ${siteName ? `<meta property="og:site_name" content="${siteName}">` : ""}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="${
    image ? "summary_large_image" : "summary"
  }">
  <meta name="twitter:title" content="${title}">
  ${
    description
      ? `<meta name="twitter:description" content="${description}">`
      : ""
  }
  ${image ? `<meta name="twitter:image" content="${image}">` : ""}
  
  <!-- Auto-redirect after 0 seconds -->
  <meta http-equiv="refresh" content="0; url=${escapeHtml(destinationUrl)}">
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(destinationUrl)}">${escapeHtml(
    destinationUrl
  )}</a>...</p>
  <script>window.location.replace("${destinationUrl.replace(
    /"/g,
    '\\"'
  )}");</script>
</body>
</html>`;
}
