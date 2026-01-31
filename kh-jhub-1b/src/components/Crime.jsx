import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapClickHandler({ onMapClick }) {
  useMapEvent("click", (e) => {
    onMapClick([e.latlng.lat, e.latlng.lng]);
  });
  return null;
}

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Crime() {
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setLocationLoaded(true);
        },
        (error) => {
          console.log("Error getting location:", error);
          // Keep default position if location access denied
          setLocationLoaded(true);
        },
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  const [crimeDetails, setCrimeDetails] = useState(null);

  useEffect(() => {
    if (!locationLoaded) return;

    async function fetchCrimeDetails() {
      const response = await fetch(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${markerPosition[0]}&lng=${markerPosition[1]}`,
      );
      const data = await response.json();
      setCrimeDetails(data);
    }
    fetchCrimeDetails();
  }, [markerPosition, locationLoaded]);

  if (!crimeDetails) {
    return <div>Loading map...</div>;
  }

  return (
    <div id="crime-container">
      <p id="crimes-h2">
        Click on the map to change location and view crime data.
      </p>
      <div style={{ height: "400px", width: "50%" }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={mapCenter} />
          <MapClickHandler onMapClick={setMarkerPosition} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition}>
            <Popup>
              Marker at [{markerPosition[0].toFixed(4)},{" "}
              {markerPosition[1].toFixed(4)}]
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div id="crime-data">
        <div id="crime-data-header">
          <h2 id="crime-data-h2">Crime Data</h2>
        </div>
        <div id="crime-data-table">
          <table id="crime-data-table">
            <thead>
              <tr id="crime-data-table-header">
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {crimeDetails &&
                crimeDetails.map((crime, index) => (
                  <tr key={index}>
                    <td id="crime-data-table-content">
                      {formatCategory(crime.category)}
                    </td>
                    <td id="crime-data-table-content">{crime.month}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
