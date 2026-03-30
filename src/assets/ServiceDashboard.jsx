import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

export default function Dashboard() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => {
        setStatuses(data);
        setLoading(false);
      })
      .catch(() => {
        setStatuses([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <div className="app-header">
        <h1 className="app-title">Foghorn</h1>
        <div className="header-divider" />
      </div>
      <div className="service-dashboard">
        {statuses.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.name}
            status={service.statusText}
            statusLevel={service.statusLevel}
            service={service}
          />
        ))}
      </div>
    </div>
  );
}
