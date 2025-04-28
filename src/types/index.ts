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
}
