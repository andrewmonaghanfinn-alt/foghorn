import {
  createBaseResult,
  findFirstMatchingValue,
  getStringValue,
  guessStatusLevelFromText,
  mapGenericHealthValueToLevel,
} from "./shared.js";

export function resolveGenericJsonResponse(serviceDefinition, parsedBody) {
  const baseResult = createBaseResult(serviceDefinition);

  const candidateStatusValue = findFirstMatchingValue(parsedBody, [
    "status",
    "health",
    "state",
    "severity",
    "level",
  ]);

  const candidateMessageValue = findFirstMatchingValue(parsedBody, [
    "message",
    "description",
    "summary",
    "detail",
    "title",
  ]);

  const statusText =
    getStringValue(candidateMessageValue) ||
    getStringValue(candidateStatusValue) ||
    "JSON status response available";

  let statusLevel = "unknown";

  if (typeof candidateStatusValue === "string") {
    statusLevel = mapGenericHealthValueToLevel(candidateStatusValue);
  }

  if (statusLevel === "unknown" && candidateStatusValue && typeof candidateStatusValue === "object") {
    const nestedStatusValue = getStringValue(
      findFirstMatchingValue(candidateStatusValue, [
        "indicator",
        "description",
        "status",
        "health",
        "state",
      ]),
    );

    statusLevel = mapGenericHealthValueToLevel(nestedStatusValue);
  }

  if (statusLevel === "unknown") {
    statusLevel = guessStatusLevelFromText(statusText);
  }

  return {
    ...baseResult,
    statusText,
    statusLevel,
    sourceType: "json",
    raw: parsedBody,
    meta: {
      resolver: "generic-json",
    },
  };
}
