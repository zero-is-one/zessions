import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { DAY_LABELS, DAY_TEXT_CLASS } from "./dayMeta";
import { CheckIcon, DirectionsIcon, getMapPinSvg, LinkIcon } from "./icons";
import { formatCompactTime } from "../lib/time";
import type { UiSession } from "./types";

interface Props {
  sessions: UiSession[];
  selectedSlug?: string | null;
  onSelectSession?: (slug: string) => void;
  className?: string;
}

// Use shared time formatting

function makeIcon(selected: boolean) {
  const color = selected ? "#4a7c59" : "#2d6a8f";
  const svg = getMapPinSvg(color);
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
    const selectedLatLng: [number, number] = [
      selected.latitude,
      selected.longitude,
    ];

    // On mobile, offset center so the popup content lands closer to screen center.
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches;

    const flyTarget = isMobile
      ? (() => {
          const point = map.project(selectedLatLng, nextZoom);
          const offsetCenter = map.unproject(point.add([0, -140]), nextZoom);
          return [offsetCenter.lat, offsetCenter.lng] as [number, number];
        })()
      : selectedLatLng;

    map.flyTo(flyTarget, nextZoom, {
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
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
                  {item.title ? (
                    <>
                      <p className="text-base font-bold leading-tight text-gray-900">
                        {item.title}
                      </p>
                      {item.locationName && (
                        <p className="text-sm text-gray-600">
                          {item.locationName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base font-bold leading-tight text-gray-900">
                      {item.locationName}
                    </p>
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
                    {formatCompactTime(item.startTime)}
                    {item.endTime
                      ? ` – ${formatCompactTime(item.endTime)}`
                      : ""}
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
                    <p className="bg-red-100 text-red-700 px-2 py-1 text-xs font-normal rounded">
                      {item.alerts}
                    </p>
                  )}
                  {item.generalInfo && (
                    <p className="text-sm text-gray-700">{item.generalInfo}</p>
                  )}
                  <div className="pt-1">
                    <div className="flex items-stretch gap-2">
                      <a
                        href={
                          item.googleMapsLink ||
                          `https://www.google.com/maps/search/${encodeURIComponent(item.address)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded bg-lichen px-3 text-sm font-semibold !text-white no-underline transition hover:bg-lichen/90 hover:!text-white"
                        title="Get directions"
                      >
                        <DirectionsIcon width={14} height={14} />
                        Directions
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${item.slug}`;
                          try {
                            await navigator.clipboard.writeText(sessionUrl);
                            setCopiedSlug(item.slug);
                            setTimeout(() => setCopiedSlug(null), 2000);
                          } catch (err) {
                            console.error("Failed to copy:", err);
                          }
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-peat/20 bg-white text-peat/70 transition hover:bg-peat/5 hover:text-peat"
                        title={
                          copiedSlug === item.slug ? "Link copied" : "Copy link"
                        }
                        aria-label={
                          copiedSlug === item.slug ? "Link copied" : "Copy link"
                        }
                      >
                        {copiedSlug === item.slug ? (
                          <CheckIcon />
                        ) : (
                          <LinkIcon />
                        )}
                      </button>
                    </div>
                    {copiedSlug === item.slug && (
                      <p className="mt-1 text-xs font-semibold text-lichen">
                        Link copied
                      </p>
                    )}
                  </div>
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
