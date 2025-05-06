import React, { useState, useEffect } from "react";
import { Restaurant, Settings } from "./types";
import { ja, en } from "./locales";
import Map from "./components/Map";
import AddRestaurantModal from "./components/AddRestaurantModal";
import RestaurantList from "./components/RestaurantList";
import SettingsModal from "./components/SettingsModal";
import UserMenu from "./components/UserMenu";

const STORAGE_KEY = "osimesi-restaurants";
const SETTINGS_KEY = "osimesi-settings";

type SortOption = "newest" | "oldest" | "favorites";

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

  const t = settings.language === "ja" ? ja : en;

  useEffect(() => {
    const savedRestaurants = localStorage.getItem(STORAGE_KEY);
    if (savedRestaurants) {
      const parsedRestaurants = JSON.parse(savedRestaurants);
      const restaurantsWithFavorite = parsedRestaurants.map(
        (restaurant: Restaurant) => ({
          ...restaurant,
          isFavorite: restaurant.isFavorite ?? false,
        })
      );
      setRestaurants(restaurantsWithFavorite);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings]);

  const handleDeleteRestaurant = (restaurantId: string) => {
    setRestaurants(
      restaurants.filter((restaurant) => restaurant.id !== restaurantId)
    );
  };

  const handleAddRestaurant = (
    restaurantData: Omit<Restaurant, "id" | "createdAt" | "isFavorite">
  ) => {
    if (!restaurantData.name.trim()) {
      alert("店名を入力してください");
      return;
    }
    if (!restaurantData.location) {
      alert("位置情報を選択してください");
      return;
    }
    if (!restaurantData.photoUrl) {
      alert("写真を選択してください");
      return;
    }

    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    setRestaurants([...restaurants, newRestaurant]);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsAddModalOpen(true);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setViewMode("map");
    setFocusedRestaurant(restaurant);
  };

  const toggleFavorite = (restaurantId: string) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t.app.title}
            </h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {viewMode === "map" ? "一覧表示" : "地図表示"}
              </button>
              <UserMenu
                isOpen={isUserMenuOpen}
                onOpen={() => setIsUserMenuOpen(true)}
                onClose={() => setIsUserMenuOpen(false)}
                onSettingsOpen={() => setIsSettingsModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div style={{ display: isAddModalOpen ? "none" : "block" }}>
            <div className="mb-4">
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
                className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
              onDelete={handleDeleteRestaurant}
            />
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
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
    </div>
  );
}

export default App;
