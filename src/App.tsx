import React, { useState, useEffect } from "react";
import { Restaurant } from "./types";
import Map from "./components/Map";
import AddRestaurantModal from "./components/AddRestaurantModal";
import RestaurantList from "./components/RestaurantList";

const STORAGE_KEY = "osimesi-restaurants";

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

  useEffect(() => {
    const savedRestaurants = localStorage.getItem(STORAGE_KEY);
    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  const handleAddRestaurant = (
    restaurantData: Omit<Restaurant, "id" | "createdAt">
  ) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
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
              restaurants={restaurants}
              onMarkerClick={handleRestaurantClick}
              onLocationSelect={handleLocationSelect}
              focusedRestaurant={focusedRestaurant}
              setFocusedRestaurant={setFocusedRestaurant}
            />
          </div>
        ) : (
          <RestaurantList
            restaurants={restaurants}
            onRestaurantClick={handleRestaurantClick}
          />
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
