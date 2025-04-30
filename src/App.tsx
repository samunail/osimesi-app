import React, { useState, useEffect } from "react";
import { Restaurant } from "./types";
import Map from "./components/Map";
import AddRestaurantModal from "./components/AddRestaurantModal";
import RestaurantList from "./components/RestaurantList";

const STORAGE_KEY = "osimesi-restaurants";

type SortOption = "name" | "date" | "favorite";

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [focusedRestaurant, setFocusedRestaurant] = useState<Restaurant | null>(
    null
  );
  const [sortOption, setSortOption] = useState<SortOption>("date");

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
      case "name":
        return a.name.localeCompare(b.name, "ja");
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "favorite":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const filteredRestaurants =
    sortOption === "favorite"
      ? sortedRestaurants.filter((restaurant) => restaurant.isFavorite)
      : sortedRestaurants;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">推し飯</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {viewMode === "map" ? "一覧表示" : "地図表示"}
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                お店を登録
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div style={{ display: isAddModalOpen ? "none" : "block" }}>
            <Map
              restaurants={filteredRestaurants}
              onRestaurantClick={handleRestaurantClick}
              focusedRestaurant={focusedRestaurant}
              setFocusedRestaurant={setFocusedRestaurant}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4 flex gap-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-2 border rounded"
              >
                <option value="date">追加日時順</option>
                <option value="name">五十音順</option>
                <option value="favorite">お気に入りのみ表示</option>
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
    </div>
  );
}

export default App;
