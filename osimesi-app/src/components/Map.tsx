import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Restaurant } from "../types";

// デフォルトアイコンのパスを修正
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 青ピンSVGアイコン（base64エンコード）
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

interface MapProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  focusedRestaurant: Restaurant | null;
  setFocusedRestaurant: (restaurant: Restaurant | null) => void;
}

const center = { lat: 35.6812, lng: 139.7671 };

const Map: React.FC<MapProps> = ({
  restaurants,
  onRestaurantClick,
  focusedRestaurant,
  setFocusedRestaurant,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      // マップの初期化
      mapRef.current = L.map("map").setView([center.lat, center.lng], 13);

      // タイルレイヤーの追加
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // マップクリックイベントの設定
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        // コントロールやUI上のクリックは無視
        if (
          e.originalEvent.target instanceof HTMLElement &&
          e.originalEvent.target.closest(".leaflet-control")
        ) {
          return;
        }
        setFocusedRestaurant({
          id: "",
          name: "",
          photoUrl: "",
          memo: "",
          location: {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
          createdAt: new Date().toISOString(),
          isFavorite: false,
        });
      });
    }

    // マーカーの更新
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // レストランのマーカーを追加
    restaurants.forEach((restaurant) => {
      const marker = L.marker(
        [restaurant.location.lat, restaurant.location.lng],
        { icon: customIcon }
      )
        .addTo(mapRef.current!)
        .bindPopup(`<b>${restaurant.name}</b>`)
        .bindTooltip(restaurant.name, {
          direction: "top",
          offset: [0, -30],
          permanent: true,
          className: "custom-tooltip",
        })
        .on("click", () => {
          onRestaurantClick(restaurant);
          marker.openPopup();
        });
      markersRef.current.push(marker);
    });

    // フォーカスされたレストランのマーカーを追加
    if (focusedRestaurant && focusedRestaurant.id) {
      const marker = L.marker(
        [focusedRestaurant.location.lat, focusedRestaurant.location.lng],
        { icon: customIcon }
      )
        .addTo(mapRef.current!)
        .bindTooltip(focusedRestaurant.name, {
          direction: "top",
          offset: [0, -30],
          permanent: true,
          className: "custom-tooltip",
        });
      markersRef.current.push(marker);
    }

    // フォーカスされたレストランの位置にマップを移動
    if (focusedRestaurant) {
      mapRef.current.setView(
        [focusedRestaurant.location.lat, focusedRestaurant.location.lng],
        13
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [restaurants, focusedRestaurant, onRestaurantClick, setFocusedRestaurant]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default React.memo(Map);
