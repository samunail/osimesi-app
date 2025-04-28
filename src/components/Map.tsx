import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant } from "../types";

interface MapProps {
  restaurants: Restaurant[];
  onMarkerClick: (restaurant: Restaurant) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  focusedRestaurant: Restaurant | null;
  setFocusedRestaurant: (restaurant: Restaurant | null) => void;
}

const Map: React.FC<MapProps> = ({
  restaurants,
  onMarkerClick,
  onLocationSelect,
  focusedRestaurant,
  setFocusedRestaurant,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerMapRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [35.6812, 139.7671],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // カスタムカーソルスタイルの設定
      const cursorStyle = `
        .leaflet-grab {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 0C5.383 0 0 5.383 0 12c0 9 12 24 12 24s12-15 12-24c0-6.617-5.383-12-12-12z" fill="%23FF0000"/></svg>') 12 36, auto !important;
        }
      `;
      const style = document.createElement("style");
      style.textContent = cursorStyle;
      document.head.appendChild(style);

      map.on("click", (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerMapRef.current = {};
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerMapRef.current = {};

    restaurants.forEach((restaurant) => {
      // 青ピンのSVGを使ったカスタムアイコン（base64エンコード）
      const bluePinSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 36'>
          <path d='M12 0C5.383 0 0 5.383 0 12c0 9 12 24 12 24s12-15 12-24c0-6.617-5.383-12-12-12z' fill='%23007bff'/>
          <circle cx='12' cy='12' r='5' fill='white'/>
        </svg>
      `;
      const bluePinBase64 = btoa(unescape(encodeURIComponent(bluePinSvg)));
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<img src='data:image/svg+xml;base64,${bluePinBase64}' style='width:40px;height:40px;display:block;'/>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker(
        [restaurant.location.lat, restaurant.location.lng],
        { icon: customIcon }
      )
        .addTo(mapRef.current!)
        // クリック時：画像・店名・メモ
        .bindPopup(
          `
          <div style='padding: 10px; max-width: 220px;'>
            <h3 style='margin: 0 0 10px 0;'>${restaurant.name}</h3>
            ${
              restaurant.photoUrl
                ? `<img src='${restaurant.photoUrl}' style='width: 100%; max-width: 200px; margin-bottom: 10px; border-radius: 4px;'>`
                : ""
            }
            <p style='margin: 0 0 10px 0;'>${restaurant.memo || ""}</p>
          </div>
        `
        )
        // ホバー時：店名のみ
        .bindTooltip(`<strong>${restaurant.name}</strong>`, {
          direction: "top",
          offset: [0, -10],
        });

      marker.on("click", () => onMarkerClick(restaurant));
      markersRef.current.push(marker);
      markerMapRef.current[restaurant.id] = marker;
    });
  }, [restaurants]);

  // 選択店舗があれば地図を移動しポップアップを開く
  useEffect(() => {
    if (!mapRef.current || !focusedRestaurant) return;
    const marker = markerMapRef.current[focusedRestaurant.id];
    if (marker) {
      mapRef.current.setView(
        [focusedRestaurant.location.lat, focusedRestaurant.location.lng],
        16,
        { animate: true }
      );
      marker.openPopup();
      setFocusedRestaurant(null); // 一度開いたらリセット
    }
  }, [focusedRestaurant, setFocusedRestaurant]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative">
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="閉じる"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <div
        ref={mapContainerRef}
        style={{
          height: isFullscreen ? "calc(100vh - 80px)" : "500px",
          width: "100%",
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 0 : "auto",
          left: isFullscreen ? 0 : "auto",
          zIndex: isFullscreen ? 100 : "auto",
        }}
      />
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="拡大"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Map;
