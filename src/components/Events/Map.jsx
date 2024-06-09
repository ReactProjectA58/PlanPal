import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue with leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = ({ address }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default to London
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) {
      // Geocode the address to get the latitude and longitude
      const geocode = async (address) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
          if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`);
          }
          const data = await response.json();
          if (data && data.length > 0) {
            setPosition([data[0].lat, data[0].lon]);
          } else {
            throw new Error("No results found for the given address");
          }
        } catch (err) {
          setError(err.message);
          console.error("Geocoding error:", err);
        }
      };
      geocode(address);
    }
  }, [address]);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
