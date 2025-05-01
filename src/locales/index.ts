export interface Translations {
  app: {
    title: string;
    addRestaurant: string;
    settings: string;
  };
  restaurant: {
    name: string;
    memo: string;
    add: string;
    cancel: string;
    delete: string;
    deleteConfirm: string;
    favorite: string;
    unfavorite: string;
  };
  settings: {
    title: string;
    theme: string;
    light: string;
    dark: string;
    language: string;
    close: string;
  };
  sort: {
    newest: string;
    oldest: string;
    favorites: string;
  };
  validation: {
    locationRequired: string;
    nameRequired: string;
    photoRequired: string;
  };
}

export { ja } from "./ja";
export { en } from "./en";
