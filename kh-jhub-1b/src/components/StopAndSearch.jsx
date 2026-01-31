import { useState, useEffect } from "react";

function formatForce(forceId) {
  return forceId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function StopAndSearch({ forceId }) {
  const [stopSearchDetails, setStopSearchDetails] = useState(null);

  useEffect(() => {
    if (!forceId) return;

    async function fetchStopSearchDetails() {
      const response = await fetch(
        `https://data.police.uk/api/stops-force?force=${forceId}`,
      );
      const data = await response.json();
      setStopSearchDetails(data);
    }
    fetchStopSearchDetails();
  }, [forceId]);

  if (!forceId) {
    return <div>Please select a police force to see details.</div>;
  }

  if (!stopSearchDetails) {
    return <div>Loading force details...</div>;
  }

  return (
    <div id="stop-search-container">
      <div id="crime-data-header">
        <h2 id="crime-data-h2">
          Stop and Search Information - {formatForce(forceId)}
        </h2>
      </div>
      <div id="stop-search-data-grid">
        {stopSearchDetails &&
          stopSearchDetails.map((item, index) => (
            <article key={index} id="stop-search-data-grid-article">
              <div>
                <p>Age Range: {item.age_range}</p>
                <p>Gender: {item.gender}</p>
                <p>Race: {item.self_defined_ethnicity}</p>
                <p>Officer Race: {item.officer_defined_ethnicity}</p>
                <p>Object of search: {item.object_of_search}</p>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
