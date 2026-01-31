import { useState } from "react";
import Header from "./components/Header";
import "./App.css";
import Forces from "./components/Forces";
import SpecificForce from "./components/SpecificForce";
import TabButton from "./components/TabButton";
import Crime from "./components/Crime";
import StopAndSearch from "./components/StopAndSearch";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [selectedTopic, setSelectedTopic] = useState();
  function handleSelect(selectedButton) {
    // selectedButton => 'Crime', 'Stop and Search'
    setSelectedTopic(selectedButton);
  }
  const [count, setCount] = useState(0);
  const [selectedForceId, setSelectedForceId] = useState(null);

  return (
    <div>
      <Header />
      <div id="forces-container">
        <Forces onSelectForce={setSelectedForceId} />
        <SpecificForce forceId={selectedForceId} />
      </div>
      <section id="crimes">
        <menu>
          <TabButton
            isSelected={selectedTopic === "Crime"}
            onSelect={() => handleSelect("Crime")}
          >
            Crime
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "Stop and Search"}
            onSelect={() => handleSelect("Stop and Search")}
          >
            Stop and Search
          </TabButton>
        </menu>
        {!selectedTopic && <p>Please select a topic to view data.</p>}
        {selectedTopic === "Crime" && <Crime />}
        {selectedTopic === "Stop and Search" && (
          <StopAndSearch forceId={selectedForceId} />
        )}
      </section>
    </div>
  );
}

export default App;
