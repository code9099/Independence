
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Helper for coloring by complaints count
const getColorByComplaints = (count: number) => {
  if (count >= 8) return "#f87171";       // Red
  if (count >= 4) return "#fde047";       // Yellow
  if (count > 0) return "#4ade80";        // Green
  return "#e5e7eb";                       // Gray/no data
};

const DELHI_GEOJSON_URL = "/delhi_boundaries.geojson"; // Load from public directory

// Utility to check if object is valid GeoJSON FeatureCollection
function isValidGeoJson(obj: any) {
  return (
    obj &&
    obj.type === "FeatureCollection" &&
    Array.isArray(obj.features) &&
    obj.features.length > 0
  );
}

const CivicHeatmap: React.FC = () => {
  const [geoJson, setGeoJson] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[CivicHeatmap] Rendered');
  });

  // Fetch GeoJSON on mount
  useEffect(() => {
    axios.get(DELHI_GEOJSON_URL)
      .then(res => {
        console.log('[CivicHeatmap] Loaded GeoJSON from', DELHI_GEOJSON_URL);
        console.log('[CivicHeatmap] Loaded GeoJSON value:', res.data);
        setGeoJson(res.data);
        setGeoError(null);
      })
      .catch((err) => {
        setGeoError("Could not load Delhi boundaries (GeoJSON missing in /public).");
        setGeoJson(null);
        console.error("GeoJSON load error (local fallback):", err);
      });
  }, []);

  // Fetch heatmap data (real-time on mount)
  useEffect(() => {
    const fetchData = () => {
      axios.get("/api/heatmap-data")
        .then(res => setHeatmap(res.data))
        .catch((err) => {
          setError("Could not load heatmap data.");
          console.error("Heatmap data error:", err);
        })
        .finally(() => setLoading(false));
    };

    fetchData();
    // Poll every 30s for live update
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  // Style for each region
  const regionStyle = (feature: any) => {
    const area = feature.properties?.AC_NAME;
    const stats = area && heatmap[area];
    const total = stats?.totalComplaints || 0;
    return {
      fillColor: getColorByComplaints(total),
      weight: 1,
      opacity: 1,
      color: "#555",
      fillOpacity: 0.7,
      dashArray: stats ? "2" : "1",
    };
  };

  // Tooltip/Popup Content
  const getTooltipContent = (feature: any) => {
    const area = feature.properties?.AC_NAME;
    const stats = area && heatmap[area];
    if (!area) return "Unknown";
    return (
      `<b>${area}</b><br/>
      Total: <b>${stats ? stats.totalComplaints : 0}</b><br/>
      Most Common: ${stats?.mostCommonType || "--"}<br/>
      Last Reported: ${stats?.lastReported ? (new Date(stats.lastReported)).toLocaleString() : "--"}`
    );
  };

  // Handle click (open thread or modal)
  const handleRegionClick = (feature: any) => {
    setSelected({
      area: feature.properties.AC_NAME,
      ...heatmap[feature.properties.AC_NAME]
    });
  };

  // Modal for mobile/desktop
  const closeModal = () => setSelected(null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: 500, border: '1px solid #dee2e6', boxShadow: '0 1px 8px #ccc' }}>
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-white/60">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading map...</div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {geoError && <div className="alert alert-warning">{geoError}</div>}
      {/* Always render the map even if geoJson loading failed */}
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: 500, width: "100%", borderRadius: "1.25rem" }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Only render GeoJSON if it is valid */}
        {isValidGeoJson(geoJson) && (
          <GeoJSON
            key={JSON.stringify(heatmap) /* re-render for live updates */}
            data={geoJson}
            style={regionStyle}
            onEachFeature={(feature, layer) => {
              const html = getTooltipContent(feature);
              layer.bindTooltip(html, { sticky: true });
              layer.on({
                click: () => handleRegionClick(feature),
              });
            }}
          />
        )}
        {/* Legend */}
        <div className="leaflet-bottom leaflet-left p-2">
          <div className="bg-white rounded shadow p-3" style={{ fontSize: 13 }}>
            <b>Legend</b>
            <div className="d-flex align-items-center mt-2">
              <div style={{ width: 18, height: 18, background: "#f87171", borderRadius: 15, marginRight: 8 }} />
              <span>8+ issues (High)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ width: 18, height: 18, background: "#fde047", borderRadius: 15, marginRight: 8 }} />
              <span>4–7 issues (Moderate)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ width: 18, height: 18, background: "#4ade80", borderRadius: 15, marginRight: 8 }} />
              <span>0–3 (Low)</span>
            </div>
          </div>
        </div>
      </MapContainer>
      {/* Modal */}
      {selected &&
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">{selected.area}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group list-group-flush mb-2">
                  <li className="list-group-item">
                    <b>Total Complaints:</b> {selected.totalComplaints || 0}
                  </li>
                  <li className="list-group-item">
                    <b>Most Frequent Type:</b> {selected.mostCommonType || "--"}
                  </li>
                  {selected.lastReported && (
                    <li className="list-group-item">
                      <b>Last Reported:</b> {new Date(selected.lastReported).toLocaleString()}
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <a href={`/threads?constituency=${encodeURIComponent(selected.area)}`} className="btn btn-primary">
                  View Issue Thread
                </a>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default CivicHeatmap;

