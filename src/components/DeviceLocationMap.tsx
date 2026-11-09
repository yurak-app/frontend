import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Leaflet's default marker icon references relative image paths that don't
// survive Vite's bundling unless explicitly imported like this — the classic
// "Leaflet + bundler" gotcha. Importing them gets Vite to resolve real URLs
// and bundle the files, so the marker renders with no external dependency.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

/**
 * A small OpenStreetMap view centered on one device's last-reported (Wi-Fi/IP,
 * approximate) location. Plain Leaflet rather than a React wrapper — this is
 * the only map in the app, so there's nothing a heavier abstraction buys here.
 */
export function DeviceLocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 11,
      // Scrolling the page shouldn't get hijacked by the map underneath the cursor.
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div ref={containerRef} className="w-full h-[220px] rounded-2xl overflow-hidden border border-border" />;
}
