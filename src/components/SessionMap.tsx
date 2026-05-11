import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { DAY_LABELS, DAY_TEXT_CLASS } from "./dayMeta";
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

function makeIcon(selected: boolean) {
  const color = selected ? "#4a7c59" : "#2d6a8f";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 18 12 18S24 20.25 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`;
  return new L.DivIcon({
    html: svg,
    className: "",
    iconSize: [24, 30],
    iconAnchor: [12, 30],
    popupAnchor: [0, -32],
  });
}

const defaultIcon = makeIcon(false);

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

function FlyToSelected({
  selected,
  defaultCenter,
}: {
  selected?: UiSession;
  defaultCenter: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !selected ||
      typeof selected.latitude !== "number" ||
      typeof selected.longitude !== "number"
    ) {
      // If no selection, fly back to default
      if (!selected) {
        map.flyTo(defaultCenter, 11, {
          animate: true,
          duration: 0.35,
        });
      }
      return;
    }
    const nextZoom = Math.max(map.getZoom(), 13);
    map.flyTo([selected.latitude, selected.longitude], nextZoom, {
      animate: true,
      duration: 0.35,
    });
  }, [map, selected, defaultCenter]);

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
    // Small delay to ensure marker is mounted and ready
    if (selectedSlug) {
      const timer = setTimeout(() => {
        const marker = markerRefs.current[selectedSlug];
        if (marker) {
          marker.openPopup();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Close all popups when nothing is selected
      Object.values(markerRefs.current).forEach((marker) => {
        if (marker) {
          marker.closePopup();
        }
      });
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
          <FlyToSelected selected={selectedSession} defaultCenter={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {mapItems.map((item) => (
            <Marker
              key={item.slug}
              position={[item.latitude as number, item.longitude as number]}
              icon={makeIcon(item.slug === selectedSlug)}
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
              <Popup minWidth={240} maxWidth={300}>
                <div className="space-y-2 py-1">
                  <p className="text-base font-bold leading-tight text-gray-900">
                    {item.title || item.locationName}
                  </p>
                  {item.title && item.title !== item.locationName && (
                    <p className="text-sm text-gray-600">{item.locationName}</p>
                  )}
                  {item.address && (
                    <a
                      href={
                        item.googleMapsLink ||
                        `https://www.google.com/maps/search/${encodeURIComponent(item.address)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      {item.address}
                    </a>
                  )}
                  <p className="text-sm text-gray-700">
                    {formatTime(item.startTime)}
                    {item.endTime ? ` – ${formatTime(item.endTime)}` : ""}
                    {" · "}
                    {item.schedule.charAt(0).toUpperCase() +
                      item.schedule.slice(1)}
                    {item.day && (
                      <>
                        {" · "}
                        <span
                          className={`font-semibold ${DAY_TEXT_CLASS[item.day]}`}
                        >
                          {DAY_LABELS[item.day]}
                        </span>
                      </>
                    )}
                  </p>
                  {item.alerts && item.alerts !== "No alerts." && (
                    <p className="flex items-start gap-1 bg-red-600 px-2 py-1 text-xs font-medium text-white">
                      <span aria-hidden="true">&#9888;</span>
                      <span>{item.alerts}</span>
                    </p>
                  )}
                  {item.generalInfo && (
                    <p className="text-sm text-gray-700">{item.generalInfo}</p>
                  )}
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
