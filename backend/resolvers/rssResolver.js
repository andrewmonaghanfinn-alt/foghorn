import {
  createBaseResult,
  getStringValue,
  guessStatusLevelFromText,
} from "./shared.js";

function getLatestFeedEntry(parsedXmlDocument) {
  const rssItems = parsedXmlDocument?.rss?.channel?.item;
  if (rssItems) {
    return Array.isArray(rssItems) ? rssItems[0] : rssItems;
  }

  const atomEntries = parsedXmlDocument?.feed?.entry;
  if (atomEntries) {
    return Array.isArray(atomEntries) ? atomEntries[0] : atomEntries;
  }

  return null;
}

function getLatestFeedText(feedEntry) {
  return {
    title:
      getStringValue(feedEntry?.title) ||
      getStringValue(feedEntry?.["atom:title"]) ||
      "",
    summary:
      getStringValue(feedEntry?.summary) ||
      getStringValue(feedEntry?.description) ||
      getStringValue(feedEntry?.content) ||
      "",
  };
}

function looksResolved(text) {
  const normalisedText = (text || "").toLowerCase();
  return (
    normalisedText.includes("resolved") ||
    normalisedText.includes("completed") ||
    normalisedText.includes("restored") ||
    normalisedText.includes("monitoring")
  );
}

export function resolveRssResponse(serviceDefinition, parsedXmlDocument) {
  const baseResult = createBaseResult(serviceDefinition);
  const latestFeedEntry = getLatestFeedEntry(parsedXmlDocument);
  const { title, summary } = getLatestFeedText(latestFeedEntry);
  const combinedText = [title, summary].filter(Boolean).join(" — ").trim();

  let statusLevel = guessStatusLevelFromText(combinedText);
  if (looksResolved(combinedText)) {
    statusLevel = "operational";
  }

  return {
    ...baseResult,
    statusText: title || summary || "Feed status available",
    statusLevel,
    sourceType: "rss",
    feedEntry: latestFeedEntry,
    meta: {
      resolver: "rss",
      detectedResolvedLanguage: looksResolved(combinedText),
    },
  };
}
