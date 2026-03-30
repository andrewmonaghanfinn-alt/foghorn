import { useMemo, useState } from "react";
import "./StatusCard.css";

export default function ServiceCard({ title, status, statusLevel, service }) {
  const [expanded, setExpanded] = useState(false);

  const levelClass = useMemo(() => {
    switch (statusLevel) {
      case "operational":
        return "status-good";
      case "degraded":
        return "status-warn";
      case "major":
        return "status-bad";
      default:
        return "status-unknown";
    }
  }, [statusLevel]);

  const components = Array.isArray(service?.components)
    ? service.components
    : [];

  const degradedComponents = components.filter(
    (component) => component?.status && component.status !== "operational",
  );

  const visibleComponents =
    degradedComponents.length > 0
      ? degradedComponents.slice(0, 6)
      : components.slice(0, 6);

  const componentSummary = {
    hasComponents: components.length > 0,
    degradedComponents,
    visibleComponents,
    hiddenCount: Math.max(0, components.length - visibleComponents.length),
  };

  function toggle() {
    setExpanded((currentValue) => !currentValue);
  }

  function onKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }

  function formatComponentStatus(componentStatus) {
    if (!componentStatus) {
      return "unknown";
    }

    return componentStatus.replaceAll("_", " ");
  }

  return (
    <article
      className={`card ${levelClass} ${expanded ? "is-expanded" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <div className="card-glow" aria-hidden="true" />
      <div className="card-noise" aria-hidden="true" />

      <div className="card-content">
        <h3 className="status-title">{title}</h3>
        <p className={`status-text ${levelClass}`}>{status}</p>

        {expanded && (
          <div className="status-details">
            <div className="detail-row">
              <span className="detail-label">Level</span>
              <span className="detail-value">{statusLevel ?? "unknown"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Source</span>
              <span className="detail-value">{service?.sourceType ?? "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Checked</span>
              <span className="detail-value">
                {service?.checkedAt
                  ? new Date(service.checkedAt).toLocaleString()
                  : "-"}
              </span>
            </div>

            {service?.page?.updated_at && (
              <div className="detail-row">
                <span className="detail-label">Updated</span>
                <span className="detail-value">
                  {new Date(service.page.updated_at).toLocaleString()}
                </span>
              </div>
            )}

            {Array.isArray(service?.incidents) && (
              <div className="detail-row">
                <span className="detail-label">Incidents</span>
                <span className="detail-value">{service.incidents.length}</span>
              </div>
            )}

            {service?.incidents?.[0]?.name && (
              <div className="detail-row">
                <span className="detail-label">Latest Incident</span>
                <span className="detail-value">
                  {service.incidents[0].name}
                </span>
              </div>
            )}

            {componentSummary.hasComponents && (
              <div className="components-section">
                <div className="section-title">Components</div>

                {componentSummary.degradedComponents.length === 0 ? (
                  <div className="component-ok">
                    All {service.components.length} components operational
                  </div>
                ) : (
                  <>
                    {componentSummary.visibleComponents.map((component) => (
                      <div key={component.id} className="component-row">
                        <span className="component-name">{component.name}</span>
                        <span
                          className={`component-status component-${component.status}`}
                        >
                          {formatComponentStatus(component.status)}
                        </span>
                      </div>
                    ))}

                    {componentSummary.hiddenCount > 0 && (
                      <div className="component-more">
                        +{componentSummary.hiddenCount} more components
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {service?.page?.url && (
              <div className="detail-row">
                <span className="detail-label">Link</span>
                <a
                  className="detail-link"
                  href={service.page.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  Open status page
                </a>
              </div>
            )}

            {service?.error?.message && (
              <div className="detail-row">
                <span className="detail-label">Error</span>
                <span className="detail-value">{service.error.message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
