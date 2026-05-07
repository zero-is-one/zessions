import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
  title: string;
  locationName: string;
}

const icon = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 18 12 18S24 20.25 24 12C24 5.373 18.627 0 12 0z" fill="#2d6a8f"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [24, 30],
  iconAnchor: [12, 30],
  popupAnchor: [0, -32],
});

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

export default function DetailMap({ lat, lng, title, locationName }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-64 w-full"
      aria-label={`Map showing location of ${title}`}
    >
      <InvalidateSize />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          <strong>{title}</strong>
          <br />
          {locationName}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
