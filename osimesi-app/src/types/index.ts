export interface Restaurant {
  id: string;
  name: string;
  photoUrl: string;
  memo: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  isFavorite: boolean;
}

export type Theme = "light" | "dark";
export type Language = "ja" | "en";

export interface Settings {
  theme: Theme;
  language: Language;
}
