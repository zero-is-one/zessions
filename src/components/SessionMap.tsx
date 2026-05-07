import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { UiSession } from "./types";

interface Props {
  sessions: UiSession[];
  selectedSlug?: string | null;
  onSelectSession?: (slug: string) => void;
  className?: string;
}

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h < 12 || h === 0 ? "am" : "pm";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m === 0 ? `${h}${ampm}` : `${h}:${mStr}${ampm}`;
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

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

function FlyToSelected({ selected }: { selected?: UiSession }) {
  const map = useMap();

  useEffect(() => {
    if (
      !selected ||
      typeof selected.latitude !== "number" ||
      typeof selected.longitude !== "number"
    ) {
      return;
    }
    const nextZoom = Math.max(map.getZoom(), 13);
    map.flyTo([selected.latitude, selected.longitude], nextZoom, {
      animate: true,
      duration: 0.35,
    });
  }, [map, selected]);

  return null;
}

export default function SessionMap({
  sessions,
  selectedSlug = null,
  onSelectSession,
  className,
}: Props) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const mapItems = useMemo(
    () =>
      sessions.filter(
        (item) =>
          typeof item.latitude === "number" &&
          typeof item.longitude === "number",
      ),
    [sessions],
  );

  const selectedSession = useMemo(
    () => mapItems.find((item) => item.slug === selectedSlug),
    [mapItems, selectedSlug],
  );

  useEffect(() => {
    if (!selectedSlug) return;
    const marker = markerRefs.current[selectedSlug];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedSlug, mapItems]);

  const center: [number, number] = selectedSession
    ? [selectedSession.latitude as number, selectedSession.longitude as number]
    : mapItems.length
      ? [mapItems[0].latitude as number, mapItems[0].longitude as number]
      : [40.7128, -74.006];

  return (
    <section
      aria-label="Map view"
      className="glass h-full overflow-hidden p-2 sm:p-3"
    >
      {mapItems.length ? (
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom
          className={className ?? "h-full w-full"}
        >
          <InvalidateSize />
          <FlyToSelected selected={selectedSession} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapItems.map((item) => (
            <Marker
              key={item.slug}
              position={[item.latitude as number, item.longitude as number]}
              icon={defaultIcon}
              ref={(marker) => {
                markerRefs.current[item.slug] = marker;
              }}
              eventHandlers={{
                click: () => {
                  onSelectSession?.(item.slug);
                },
                popupopen: () => {
                  onSelectSession?.(item.slug);
                },
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{item.title}</p>
                  <p>{item.locationName}</p>
                  <p>
                    {formatTime(item.startTime)}
                    {item.endTime ? ` – ${formatTime(item.endTime)}` : ""}
                    {" · "}
                    {item.schedule.charAt(0).toUpperCase() +
                      item.schedule.slice(1)}
                    {item.day
                      ? ` · ${item.day.charAt(0).toUpperCase() + item.day.slice(1)}s`
                      : ""}
                  </p>
                  {item.alerts && item.alerts !== "No alerts." && (
                    <p className="flex items-start gap-1 bg-red-600 px-2 py-1 text-xs font-medium text-white">
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
          No sessions match the current filters.
        </p>
      )}
    </section>
  );
}
