import { createBaseResult, getMostSevereStatusLevel } from "./shared.js";

function mapStatuspageIndicatorToLevel(statusIndicator) {
  switch ((statusIndicator || "").toLowerCase()) {
    case "none":
      return "operational";
    case "minor":
      return "degraded";
    case "major":
    case "critical":
      return "major";
    default:
      return "unknown";
  }
}

function mapStatuspageComponentStatusToLevel(componentStatus) {
  switch ((componentStatus || "").toLowerCase()) {
    case "operational":
      return "operational";
    case "under_maintenance":
    case "degraded_performance":
    case "partial_outage":
      return "degraded";
    case "major_outage":
      return "major";
    default:
      return "unknown";
  }
}

function mapStatuspageIncidentImpactToLevel(incidentImpact) {
  switch ((incidentImpact || "").toLowerCase()) {
    case "none":
      return "operational";
    case "minor":
      return "degraded";
    case "major":
    case "critical":
      return "major";
    default:
      return "unknown";
  }
}

function getComponentAggregateLevel(components = []) {
  if (!Array.isArray(components) || components.length === 0) {
    return null;
  }

  return getMostSevereStatusLevel(
    components.map((component) =>
      mapStatuspageComponentStatusToLevel(component?.status),
    ),
  );
}

function getActiveIncidentAggregateLevel(incidents = []) {
  if (!Array.isArray(incidents) || incidents.length === 0) {
    return null;
  }

  const activeIncidents = incidents.filter((incident) => {
    const incidentStatus = (incident?.status || "").toLowerCase();
    return !["resolved", "completed", "postmortem", "closed"].includes(
      incidentStatus,
    );
  });

  if (activeIncidents.length === 0) {
    return null;
  }

  return getMostSevereStatusLevel(
    activeIncidents.map((incident) =>
      mapStatuspageIncidentImpactToLevel(incident?.impact),
    ),
  );
}

export function canResolveStatuspage(parsedBody) {
  return Boolean(parsedBody?.page && parsedBody?.status);
}

export function resolveStatuspageResponse(serviceDefinition, parsedBody) {
  const baseResult = createBaseResult(serviceDefinition);
  const statusDescription =
    parsedBody?.status?.description ?? "No status available";
  const indicatorLevel = mapStatuspageIndicatorToLevel(
    parsedBody?.status?.indicator,
  );
  const componentLevel = getComponentAggregateLevel(parsedBody?.components);
  const activeIncidentLevel = getActiveIncidentAggregateLevel(
    parsedBody?.incidents,
  );

  return {
    ...baseResult,
    name: parsedBody?.page?.name ?? serviceDefinition.name,
    statusText: statusDescription,
    statusLevel: getMostSevereStatusLevel([
      indicatorLevel,
      componentLevel,
      activeIncidentLevel,
    ]),
    sourceType: "statuspage",
    page: parsedBody?.page ?? null,
    components: parsedBody?.components ?? [],
    incidents: parsedBody?.incidents ?? [],
    scheduledMaintenances: parsedBody?.scheduled_maintenances ?? [],
    meta: {
      resolver: "statuspage",
      indicator: parsedBody?.status?.indicator ?? null,
      indicatorLevel,
      componentLevel,
      activeIncidentLevel,
    },
  };
}
