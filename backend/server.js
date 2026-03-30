import express from "express";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";
import monitoredServices from "./services.js";
import { createBaseResult } from "./resolvers/shared.js";
import {
  canResolveStatuspage,
  resolveStatuspageResponse,
} from "./resolvers/statuspageResolver.js";
import { resolveGenericJsonResponse } from "./resolvers/genericJsonResolver.js";
import { resolveRssResponse } from "./resolvers/rssResolver.js";
import { resolveHtmlResponse } from "./resolvers/htmlResolver.js";

const app = express();
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});
const backendPort = 3001;
const cacheDurationInMilliseconds = 60_000;

let cachedStatusResponse = {
  timestamp: 0,
  payload: null,
};

app.use(
  cors({
    origin: true,
  }),
);

function parseResponseBody(responseBodyText, contentTypeHeader) {
  const normalizedContentType = (contentTypeHeader || "").toLowerCase();
  const trimmedBody = (responseBodyText || "").trim();

  if (normalizedContentType.includes("application/json")) {
    return {
      format: "json",
      parsedBody: JSON.parse(trimmedBody),
    };
  }

  if (
    normalizedContentType.includes("application/xml") ||
    normalizedContentType.includes("text/xml") ||
    normalizedContentType.includes("application/rss+xml") ||
    normalizedContentType.includes("application/atom+xml")
  ) {
    return {
      format: "xml",
      parsedBody: xmlParser.parse(trimmedBody),
    };
  }

  if (trimmedBody.startsWith("{") || trimmedBody.startsWith("[")) {
    return {
      format: "json",
      parsedBody: JSON.parse(trimmedBody),
    };
  }

  if (trimmedBody.startsWith("<")) {
    const lowerCasedBody = trimmedBody.toLowerCase();

    if (
      lowerCasedBody.includes("<rss") ||
      lowerCasedBody.includes("<feed") ||
      lowerCasedBody.includes("<?xml")
    ) {
      return {
        format: "xml",
        parsedBody: xmlParser.parse(trimmedBody),
      };
    }

    return {
      format: "html",
      parsedBody: trimmedBody,
    };
  }

  return {
    format: "text",
    parsedBody: trimmedBody,
  };
}

function resolveParsedResponse(serviceDefinition, parsedResponse) {
  const { format, parsedBody } = parsedResponse;

  if (serviceDefinition.resolver === "statuspage") {
    return resolveStatuspageResponse(serviceDefinition, parsedBody);
  }

  if (serviceDefinition.resolver === "rss") {
    return resolveRssResponse(serviceDefinition, parsedBody);
  }

  if (serviceDefinition.resolver === "html") {
    return resolveHtmlResponse(serviceDefinition, parsedBody);
  }

  if (format === "json") {
    if (canResolveStatuspage(parsedBody)) {
      return resolveStatuspageResponse(serviceDefinition, parsedBody);
    }

    return resolveGenericJsonResponse(serviceDefinition, parsedBody);
  }

  if (format === "xml") {
    return resolveRssResponse(serviceDefinition, parsedBody);
  }

  if (format === "html") {
    return resolveHtmlResponse(serviceDefinition, parsedBody);
  }

  return {
    ...createBaseResult(serviceDefinition),
    statusText: "Unsupported response format",
    statusLevel: "unknown",
    sourceType: format,
    meta: {
      resolver: "unsupported-format",
      detectedFormat: format,
    },
  };
}

async function fetchServiceStatus(serviceDefinition) {
  const baseResult = createBaseResult(serviceDefinition);

  try {
    const response = await fetch(serviceDefinition.url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept:
          "application/json, application/xml, text/xml, text/html, text/plain, */*",
      },
    });

    const responseBodyText = await response.text();

    if (!response.ok) {
      return {
        ...baseResult,
        statusText: `HTTP ${response.status}`,
        meta: {
          resolver: "http-error",
          statusCode: response.status,
        },
      };
    }

    let parsedResponse;

    try {
      parsedResponse = parseResponseBody(
        responseBodyText,
        response.headers.get("content-type"),
      );
    } catch (parseError) {
      return {
        ...baseResult,
        statusText: `Parse failed (${parseError?.message || "unknown parse error"})`,
        meta: {
          resolver: "parse-failure",
          errorName: parseError?.name,
          errorMessage: parseError?.message,
        },
      };
    }

    const resolvedResult = resolveParsedResponse(
      serviceDefinition,
      parsedResponse,
    );

    return {
      ...resolvedResult,
      checkedAt: new Date().toISOString(),
      meta: {
        ...resolvedResult.meta,
        responseFormat: parsedResponse.format,
        contentType: response.headers.get("content-type"),
      },
    };
  } catch (error) {
    console.error(`[${serviceDefinition.id}] fetch error`, {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      cause: error?.cause,
    });

    return {
      ...baseResult,
      statusText: `Unavailable (${error?.message || "fetch failed"})`,
      meta: {
        resolver: "fetch-failure",
        errorName: error?.name,
        errorMessage: error?.message,
      },
    };
  }
}

app.get("/api/status", async (request, response) => {
  const currentTime = Date.now();
  const cacheIsStillValid =
    cachedStatusResponse.payload &&
    currentTime - cachedStatusResponse.timestamp < cacheDurationInMilliseconds;

  if (cacheIsStillValid) {
    return response.json(cachedStatusResponse.payload);
  }

  const resolvedStatuses = await Promise.all(
    monitoredServices.map(fetchServiceStatus),
  );

  cachedStatusResponse = {
    timestamp: currentTime,
    payload: resolvedStatuses,
  };

  return response.json(resolvedStatuses);
});

app.listen(backendPort, () => {
  console.log(`Backend listening on http://localhost:${backendPort}`);
});
