import React from "react";
import { Restaurant } from "../types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onRestaurantClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onRestaurantClick(restaurant)}
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={restaurant.photoUrl}
              alt={restaurant.name}
              className="object-cover w-full h-48"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(restaurant.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {restaurant.memo}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;