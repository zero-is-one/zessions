import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { UiOccurrence } from "./types";

interface Props {
  occurrences: UiOccurrence[];
}

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const nyFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function SessionMap({ occurrences }: Props) {
  const mapItems = useMemo(
    () =>
      occurrences.filter(
        (item) =>
          typeof item.latitude === "number" &&
          typeof item.longitude === "number",
      ),
    [occurrences],
  );

  const center: [number, number] = mapItems.length
    ? [mapItems[0].latitude as number, mapItems[0].longitude as number]
    : [40.7128, -74.006];

  return (
    <section aria-label="Map view" className="glass overflow-hidden p-3 sm:p-4">
      {mapItems.length ? (
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom
          className="h-[440px] w-full rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapItems.map((item) => (
            <Marker
              key={item.occurrenceId}
              position={[item.latitude as number, item.longitude as number]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{item.title}</p>
                  <p>{item.locationName}</p>
                  <p>{nyFormatter.format(new Date(item.start))}</p>
                  {item.alerts && item.alerts !== "No alerts." && (
                    <p className="flex items-start gap-1 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
                      <span aria-hidden="true">&#9888;</span>
                      <span>{item.alerts}</span>
                    </p>
                  )}
                  <p>
                    <strong>Info:</strong> {item.generalInfo}
                  </p>
                  <a href={`/sessions/${item.slug}/`}>Open details</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p className="p-4 text-sm text-peat/70">
          No mappable session coordinates yet.
        </p>
      )}
    </section>
  );
}
