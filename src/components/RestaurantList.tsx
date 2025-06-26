import React from "react";
import { Restaurant } from "../types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  onToggleFavorite: (restaurantId: string) => void;
  onDeleteRequest: (restaurant: Restaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onRestaurantClick,
  onToggleFavorite,
  onDeleteRequest,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={restaurant.photoUrl}
              alt={restaurant.name}
              className="object-cover w-full h-48"
              onClick={() => onRestaurantClick(restaurant)}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3
                className="text-lg font-semibold"
                onClick={() => onRestaurantClick(restaurant)}
              >
                {restaurant.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRequest(restaurant);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(restaurant.id);
                  }}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  {restaurant.isFavorite ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
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
