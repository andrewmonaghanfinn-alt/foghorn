import { load } from "cheerio";
import { createBaseResult } from "./shared.js";
import {
  canResolveStatuspage,
  resolveStatuspageResponse,
} from "./statuspageResolver.js";
import { resolveGenericJsonResponse } from "./genericJsonResolver.js";

function tryParseJson(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractEmbeddedJsonCandidates(htmlText) {
  if (!htmlText || typeof htmlText !== "string") {
    return [];
  }

  const $ = load(htmlText);
  const candidates = [];

  $('script[type="application/json"], script[type="application/ld+json"]').each(
    (_, element) => {
      const scriptText = $(element).html();
      const parsedJson = tryParseJson(scriptText);

      if (parsedJson) {
        candidates.push(parsedJson);
      }
    },
  );

  return candidates;
}

function findResolvableJsonCandidate(htmlText) {
  const candidates = extractEmbeddedJsonCandidates(htmlText);

  for (const candidate of candidates) {
    if (canResolveStatuspage(candidate)) {
      return {
        resolverType: "statuspage",
        parsedBody: candidate,
      };
    }
  }

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      return {
        resolverType: "generic-json",
        parsedBody: candidate,
      };
    }
  }

  return null;
}

export function resolveHtmlResponse(serviceDefinition, htmlText) {
  const baseResult = createBaseResult(serviceDefinition);
  const resolvableCandidate = findResolvableJsonCandidate(htmlText);

  if (resolvableCandidate?.resolverType === "statuspage") {
    const resolvedResult = resolveStatuspageResponse(
      serviceDefinition,
      resolvableCandidate.parsedBody,
    );

    return {
      ...resolvedResult,
      sourceType: "html",
      meta: {
        ...resolvedResult.meta,
        resolver: "html-embedded-statuspage-json",
      },
    };
  }

  if (resolvableCandidate?.resolverType === "generic-json") {
    const resolvedResult = resolveGenericJsonResponse(
      serviceDefinition,
      resolvableCandidate.parsedBody,
    );

    return {
      ...resolvedResult,
      sourceType: "html",
      meta: {
        ...resolvedResult.meta,
        resolver: "html-embedded-generic-json",
      },
    };
  }

  return {
    ...baseResult,
    statusText: "Structured status not available on vendor HTML page",
    statusLevel: "unknown",
    sourceType: "html",
    meta: {
      resolver: "html",
    },
  };
}
