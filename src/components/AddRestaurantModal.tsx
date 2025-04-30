import React, { useState, useEffect, useRef } from "react";
import { Restaurant } from "../types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (restaurant: Omit<Restaurant, "id" | "createdAt">) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  selectedLocation,
}) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [memo, setMemo] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    selectedLocation
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // 画面サイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapRef.current) {
      // カスタムカーソルスタイルの設定
      const cursorStyle = `
        .leaflet-grab {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 0C5.383 0 0 5.383 0 12c0 9 12 24 12 24s12-15 12-24c0-6.617-5.383-12-12-12z" fill="%23FF0000"/></svg>') 12 36, auto !important;
        }
      `;
      const style = document.createElement("style");
      style.textContent = cursorStyle;
      document.head.appendChild(style);

      // マップコンテナのスタイルを設定
      if (mapContainerRef.current) {
        mapContainerRef.current.style.position = "relative";
        mapContainerRef.current.style.zIndex = "1";
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([35.6812, 139.7671], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });

        // マーカーを更新
        if (markerRef.current) {
          markerRef.current.remove();
        }

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
        markerRef.current = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: customIcon,
        }).addTo(map);
      });

      mapRef.current = map;

      // 選択済みの位置情報がある場合はマーカーを表示
      if (selectedLocation) {
        // 青ピンSVGアイコン
        const bluePinSvg = `
          <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 36'>
            <path d='M12 0C5.383 0 0 5.383 0 12c0 9 12 24 12 24s12-15 12-24c0-6.617-5.383-12-12-12z' fill='%23007bff'/>
            <circle cx='12' cy='12' r='5' fill='white'/>
          </svg>
        `;
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<img src='data:image/svg+xml;utf8,${encodeURIComponent(
            bluePinSvg
          )}' style='width:40px;height:40px;display:block;'/>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
        markerRef.current = L.marker(
          [selectedLocation.lat, selectedLocation.lng],
          { icon: customIcon }
        ).addTo(map);
        map.setView([selectedLocation.lat, selectedLocation.lng], 15);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [isOpen, selectedLocation]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("位置情報を選択してください");
      return;
    }
    if (!name.trim()) {
      alert("店名を入力してください");
      return;
    }
    if (!photo) {
      alert("写真を選択してください");
      return;
    }

    onAdd({
      name,
      photoUrl: photo,
      memo,
      location,
      isFavorite: false,
    });

    setName("");
    setPhoto("");
    setMemo("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white p-4 md:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ position: "relative", zIndex: 1000 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">推し飯を登録</h2>
          <button
            onClick={onClose}
            style={{
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
        </div>

        {isMobile ? (
          // モバイル表示: 縦に並べる
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">店名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">写真</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  位置情報: {location ? "選択済み" : "地図上で選択してください"}
                </p>
              </div>
            </div>

            <div className="relative" style={{ height: "250px", zIndex: 1 }}>
              <div
                ref={mapContainerRef}
                style={{ height: "100%", width: "100%" }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!location}
              >
                登録
              </button>
            </div>
          </div>
        ) : (
          // デスクトップ表示: 2カラムレイアウト
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">店名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">写真</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  位置情報: {location ? "選択済み" : "地図上で選択してください"}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!location}
                >
                  登録
                </button>
              </div>
            </div>

            <div className="relative" style={{ height: "400px", zIndex: 1 }}>
              <div
                ref={mapContainerRef}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRestaurantModal;
