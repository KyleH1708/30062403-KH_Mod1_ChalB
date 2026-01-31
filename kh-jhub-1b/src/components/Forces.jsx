import { useState, useEffect } from "react";

export default function Forces({ onSelectForce }) {
  const [forces, setForces] = useState([]);

  useEffect(() => {
    async function fetchForces() {
      const response = await fetch("https://data.police.uk/api/forces");
      const data = await response.json();
      setForces(data);
    }
    fetchForces();
  }, []);

  return (
    <div id="forces">
      <h2 id="forces-h2">Police Forces</h2>
      <select id="force-select" onChange={(e) => onSelectForce(e.target.value)}>
        <option value="">Select a force</option>
        {forces.map((force) => (
          <option key={force.id} value={force.id}>
            {force.name}
          </option>
        ))}
      </select>
    </div>
  );
}
