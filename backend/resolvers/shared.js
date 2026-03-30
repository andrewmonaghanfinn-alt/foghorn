export const statusSeverityOrder = {
  unknown: 0,
  operational: 1,
  degraded: 2,
  major: 3,
};

export function createBaseResult(serviceDefinition) {
  return {
    id: serviceDefinition.id,
    name: serviceDefinition.name,
    statusText: "Status unavailable",
    statusLevel: "unknown",
    sourceType: serviceDefinition.resolver,
    checkedAt: new Date().toISOString(),
    url: serviceDefinition.url,
    meta: {},
  };
}

export function isRecognizedStatusLevel(level) {
  return ["unknown", "operational", "degraded", "major"].includes(level);
}

export function getMostSevereStatusLevel(statusLevels = []) {
  return statusLevels.reduce((mostSevereLevel, currentLevel) => {
    if (!isRecognizedStatusLevel(currentLevel)) {
      return mostSevereLevel;
    }

    return statusSeverityOrder[currentLevel] >
      statusSeverityOrder[mostSevereLevel]
      ? currentLevel
      : mostSevereLevel;
  }, "unknown");
}

export function getStringValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const extractedValue = getStringValue(item);
      if (extractedValue) {
        return extractedValue;
      }
    }
    return "";
  }

  if (value && typeof value === "object") {
    return (
      getStringValue(value["#text"]) ||
      getStringValue(value._) ||
      getStringValue(value.title) ||
      getStringValue(value.value) ||
      ""
    );
  }

  return "";
}

export function guessStatusLevelFromText(text) {
  const normalizedText = (text || "").toLowerCase();

  if (!normalizedText) {
    return "unknown";
  }

  if (
    normalizedText.includes("all systems operational") ||
    normalizedText.includes("fully operational") ||
    normalizedText.includes("everything is running smoothly") ||
    normalizedText.includes("healthy") ||
    normalizedText.includes("service restored") ||
    normalizedText.includes("issue resolved") ||
    normalizedText.includes("resolved") ||
    normalizedText.includes("operational")
  ) {
    return "operational";
  }

  if (
    normalizedText.includes("degraded") ||
    normalizedText.includes("partial outage") ||
    normalizedText.includes("partial disruption") ||
    normalizedText.includes("delays") ||
    normalizedText.includes("latency") ||
    normalizedText.includes("intermittent") ||
    normalizedText.includes("minor") ||
    normalizedText.includes("performance issues")
  ) {
    return "degraded";
  }

  if (
    normalizedText.includes("major outage") ||
    normalizedText.includes("service outage") ||
    normalizedText.includes("outage") ||
    normalizedText.includes("critical") ||
    normalizedText.includes("down") ||
    normalizedText.includes("unavailable") ||
    normalizedText.includes("disruption")
  ) {
    return "major";
  }

  return "unknown";
}

export function mapGenericHealthValueToLevel(value) {
  const normalizedValue = (value || "").toString().trim().toLowerCase();

  switch (normalizedValue) {
    case "ok":
    case "healthy":
    case "pass":
    case "passing":
    case "up":
    case "available":
    case "operational":
    case "green":
      return "operational";

    case "warn":
    case "warning":
    case "degraded":
    case "partial":
    case "minor":
    case "yellow":
      return "degraded";

    case "fail":
    case "failing":
    case "error":
    case "critical":
    case "major":
    case "down":
    case "red":
    case "unavailable":
      return "major";

    default:
      return "unknown";
  }
}

export function findFirstMatchingValue(objectToSearch, candidateKeys) {
  if (!objectToSearch || typeof objectToSearch !== "object") {
    return null;
  }

  for (const key of candidateKeys) {
    if (objectToSearch[key] !== undefined && objectToSearch[key] !== null) {
      return objectToSearch[key];
    }
  }

  return null;
}
