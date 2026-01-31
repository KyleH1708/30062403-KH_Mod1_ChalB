import { useState, useEffect } from "react";

export default function SpecificForce({ forceId }) {
  const [forceDetails, setForceDetails] = useState(null);

  useEffect(() => {
    if (!forceId) return;

    async function fetchForceDetails() {
      const response = await fetch(
        `https://data.police.uk/api/forces/${forceId}`,
      );
      const data = await response.json();
      setForceDetails(data);
    }
    fetchForceDetails();
  }, [forceId]);

  if (!forceId) {
    return <div id="forces">Please select a police force to see details.</div>;
  }

  if (!forceDetails) {
    return <div id="forces">Loading force details...</div>;
  }

  return (
    <div id="forces">
      <h2>{forceDetails.name}</h2>
      <p>
        <strong>URL:</strong>{" "}
        <a href={forceDetails.url} target="_blank" rel="noopener noreferrer">
          {forceDetails.url}
        </a>
      </p>
      <p>
        <strong>Telephone:</strong> {forceDetails.telephone}
      </p>
    </div>
  );
}
