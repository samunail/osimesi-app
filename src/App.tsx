import React, { useState, useEffect } from "react";
import { Restaurant, Settings } from "./types";
import { ja, en } from "./locales";
import Map from "./components/Map";
import AddRestaurantModal from "./components/AddRestaurantModal";
import RestaurantList from "./components/RestaurantList";
import SettingsModal from "./components/SettingsModal";
import UserMenu from "./components/UserMenu";
import ConfirmModal from "./components/ConfirmModal";

const API_URL = "http://localhost:8000/api/restaurants/";
const SETTINGS_KEY = "osimesi-settings";

type SortOption = "newest" | "oldest" | "favorites";

function toCamelCaseRestaurant(apiData: any): Restaurant {
  return {
    id:
      apiData && apiData.id !== undefined && apiData.id !== null
        ? apiData.id.toString()
        : "",
    name: apiData?.name ?? "",
    photoUrl: apiData?.photo
      ? apiData.photo.startsWith("http")
        ? apiData.photo
        : `http://localhost:8000${apiData.photo}`
      : "",
    memo: apiData?.memo ?? "",
    location: { lat: apiData?.lat ?? 0, lng: apiData?.lng ?? 0 },
    createdAt: apiData?.created_at ?? "",
    isFavorite: apiData?.is_favorite ?? false,
  };
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [focusedRestaurant, setFocusedRestaurant] = useState<Restaurant | null>(
    null
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings
      ? JSON.parse(savedSettings)
      : { theme: "light", language: "ja" };
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const t = settings.language === "ja" ? ja : en;

  // Django REST APIからレストラン一覧を取得
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setRestaurants(data.map(toCamelCaseRestaurant)));
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings]);

  // レストラン追加
  const handleAddRestaurant = (restaurantData: {
    name: string;
    photoFile: File;
    memo: string;
    location: { lat: number; lng: number };
    isFavorite: boolean;
  }) => {
    if (!restaurantData.name.trim()) {
      alert("店名を入力してください");
      return;
    }
    if (!restaurantData.location) {
      alert("位置情報を選択してください");
      return;
    }
    if (!restaurantData.photoFile) {
      alert("写真を選択してください");
      return;
    }
    const formData = new FormData();
    formData.append("name", restaurantData.name);
    formData.append("photo", restaurantData.photoFile);
    formData.append("memo", restaurantData.memo);
    formData.append("lat", String(restaurantData.location.lat));
    formData.append("lng", String(restaurantData.location.lng));
    formData.append("is_favorite", String(restaurantData.isFavorite));

    fetch(API_URL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newRestaurant) =>
        setRestaurants((prev) => [
          ...prev,
          toCamelCaseRestaurant(newRestaurant),
        ])
      );
  };

  // レストラン削除
  const handleDeleteRestaurant = (restaurantId: string) => {
    fetch(`${API_URL}${restaurantId}/`, {
      method: "DELETE",
    }).then(() =>
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId))
    );
  };

  // お気に入り切り替え
  const toggleFavorite = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) return;
    fetch(`${API_URL}${restaurant.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: restaurant.name,
        photo_url: restaurant.photoUrl,
        memo: restaurant.memo,
        lat: restaurant.location.lat,
        lng: restaurant.location.lng,
        is_favorite: !restaurant.isFavorite,
        created_at: restaurant.createdAt,
      }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === updated.id ? toCamelCaseRestaurant(updated) : r
          )
        )
      );
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setViewMode("map");
    setFocusedRestaurant(restaurant);
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "favorites":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const filteredRestaurants =
    sortOption === "favorites"
      ? sortedRestaurants.filter((restaurant) => restaurant.isFavorite)
      : sortedRestaurants;

  const handleDeleteRequest = (restaurant: Restaurant) => {
    setDeleteTarget(restaurant);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      handleDeleteRestaurant(deleteTarget.id);
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="backdrop-blur bg-slate-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow">
            {t.app.title}
          </h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
              className="px-5 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-full shadow hover:scale-105 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              {viewMode === "map" ? t.viewModeList : t.viewModeMap}
            </button>
            <UserMenu
              isOpen={isUserMenuOpen}
              onOpen={() => setIsUserMenuOpen(true)}
              onClose={() => setIsUserMenuOpen(false)}
              onSettingsOpen={() => setIsSettingsModalOpen(true)}
              menuLabels={{
                login: t.menuLogin,
                friend: t.menuFriend,
                settings: t.menuSettings,
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {viewMode === "map" ? (
          <div style={{ display: isAddModalOpen ? "none" : "block" }}>
            <div className="h-[600px] rounded-2xl overflow-hidden box-border">
              <Map
                restaurants={filteredRestaurants}
                onRestaurantClick={handleRestaurantClick}
                focusedRestaurant={focusedRestaurant}
                setFocusedRestaurant={setFocusedRestaurant}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex gap-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 shadow"
              >
                <option value="newest">{t.sort.newest}</option>
                <option value="oldest">{t.sort.oldest}</option>
                <option value="favorites">{t.sort.favorites}</option>
              </select>
            </div>
            <RestaurantList
              restaurants={filteredRestaurants}
              onRestaurantClick={handleRestaurantClick}
              onToggleFavorite={toggleFavorite}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>
        )}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl"
          >
            {t.app.addRestaurant}
          </button>
        </div>
      </main>

      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedLocation(null);
        }}
        onAdd={handleAddRestaurant}
        selectedLocation={selectedLocation}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message={t.restaurant.deleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okLabel={t.restaurant.delete}
        cancelLabel={t.restaurant.cancel}
        darkMode={settings.theme === "dark"}
      />
    </div>
  );
}

export default App;
