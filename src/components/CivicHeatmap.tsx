
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_CENTER = [77.209, 28.6139];
const DELHI_GEOJSON_URL = "https://opendatadelhi.s3.ap-south-1.amazonaws.com/vidhan_sabha_constituencies.geojson";

const CivicHeatmap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [legendOpen, setLegendOpen] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || mapReady) return;

    mapboxgl.accessToken = mapboxToken;
    let map: mapboxgl.Map;

    const initializeMap = async () => {
      try {
        map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center: MAP_CENTER,
          zoom: 10.6,
          pitch: 0,
        });
        mapRef.current = map;

        // Fetch Delhi boundaries (GeoJSON)
        const geojson = await fetch(DELHI_GEOJSON_URL).then(res => res.json());

        // Fetch heatmap data from backend
        const heatmapData = await fetch("/api/heatmap-data").then(res => res.json());

        map.on("load", () => {
          map.addSource("boundaries", {
            type: "geojson",
            data: geojson,
          });
          map.addLayer({
            id: "regions-heat",
            type: "fill",
            source: "boundaries",
            layout: {},
            paint: {
              "fill-color": [
                "case",
                ["has", ["get", "AC_NAME"], ["literal", heatmapData]],
                [
                  "let",
                  "cname",
                  ["get", "AC_NAME"],
                  [
                    "case",
                    [">=", ["get", ["var", "cname"], ["literal", heatmapData], "totalComplaints"], 8], "#f87171",
                    [">=", ["get", ["var", "cname"], ["literal", heatmapData], "totalComplaints"], 4], "#fde047",
                    "#4ade80"
                  ]
                ],
                "#e5e7eb"
              ],
              "fill-opacity": 0.65,
              "fill-outline-color": "#555"
            }
          });

          let popup: mapboxgl.Popup | null = null;
          map.on("mousemove", "regions-heat", e => {
            map.getCanvas().style.cursor = "pointer";
            if (!e.features || !e.features[0]) return;
            const feature = e.features[0];
            const area = feature.properties?.AC_NAME;
            const stats = area && heatmapData[area];
            const html = stats
              ? `<div style="min-width:150px">
                  <b>${area}</b><br/>
                  Total: <b>${stats.totalComplaints}</b><br/>
                  Active: ${stats.activeComplaints}<br/>
                  Resolved: ${stats.resolvedComplaints}<br/>
                  <span>Most Common: ${stats.mostCommonType || "—"}</span>
                </div>`
              : `<b>${area}</b><br/>No data`;

            if (!popup) popup = new mapboxgl.Popup({ closeButton: false, offset: 12 });
            popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
          });

          map.on("mouseleave", "regions-heat", () => {
            map.getCanvas().style.cursor = "";
            if (popup) popup.remove();
          });

          map.on("click", "regions-heat", e => {
            if (!e.features || !e.features[0]) return;
            const feature = e.features[0];
            const area = feature.properties?.AC_NAME;
            const center =
              feature &&
              feature.geometry &&
              feature.geometry.type === "Polygon"
                ? feature.geometry.coordinates[0].reduce(
                    (sum: any, coord: number[]) => [sum[0] + coord[0], sum[1] + coord[1]],
                    [0, 0]
                  ).map((v: number, i: number, arr: number[]) => v / arr.length)
                : MAP_CENTER;
            map.flyTo({ center, zoom: 13, pitch: 20, duration: 1200 });
            // Optionally: Open a thread/issues-list sidebar for this area.
          });
          setMapReady(true);
        });
      } catch (e: any) {
        setError("Could not load map. Please check your token or network connection.");
      }
    };

    initializeMap();

    return () => {
      map?.remove();
    };
    // Run only when mapboxToken changes or component mounts
    // eslint-disable-next-line
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-[600px] md:rounded-2xl overflow-hidden shadow-lg border">
      {!mapboxToken && (
        <div className="absolute inset-0 z-20 bg-white/80 flex flex-col items-center justify-center gap-4">
          <div className="text-center max-w-sm text-gray-700">
            <b>Mapbox token required!</b>
            <p className="text-sm mt-2">
              Please paste your Mapbox public access token below. <br />
              <a
                href="https://account.mapbox.com/access-tokens/"
                className="underline text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >Find your token in the Mapbox dashboard</a>
            </p>
          </div>
          <input
            className="px-3 py-2 rounded-lg border text-black font-mono w-80"
            placeholder="Paste Mapbox public token..."
            value={mapboxToken}
            onChange={e => setMapboxToken(e.target.value.trim())}
            spellCheck={false}
            />
          {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
      )}

      <div ref={mapContainer} className="absolute inset-0" />
      {mapboxToken && legendOpen && (
        <div className="absolute bottom-4 left-4 p-3 bg-white/90 rounded-xl shadow-lg border flex flex-col gap-2 text-xs z-10">
          <b className="mb-1 text-sm text-gray-800">Legend</b>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-[#f87171] rounded-full mr-2"></span>
            <span>8+ issues (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-[#fde047] rounded-full mr-2"></span>
            <span>4–7 issues (Moderate)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-[#4ade80] rounded-full mr-2"></span>
            <span>0–3 issues (Low)</span>
          </div>
          <button type="button" className="mt-2 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => setLegendOpen(false)}>Hide legend</button>
        </div>
      )}
      {mapboxToken && !legendOpen &&
        <button
          className="absolute bottom-4 left-4 p-2 bg-white/80 rounded shadow border z-10"
          onClick={() => setLegendOpen(true)}
        >Show legend</button>}
    </div>
  );
};

export default CivicHeatmap;
