import type { Translations } from "./index";

export const ja: Translations = {
  app: {
    title: "レストランマップ",
    addRestaurant: "レストランを追加",
    settings: "設定",
  },
  restaurant: {
    name: "店名",
    memo: "メモ",
    add: "追加",
    cancel: "キャンセル",
    delete: "削除",
    deleteConfirm: "このレストランを削除しますか？",
    favorite: "お気に入り",
    unfavorite: "お気に入り解除",
  },
  settings: {
    title: "設定",
    theme: "テーマ",
    light: "ライト",
    dark: "ダーク",
    language: "言語",
    close: "閉じる",
  },
  sort: {
    newest: "新着順",
    oldest: "古い順",
    favorites: "お気に入りのみ表示",
  },
  validation: {
    locationRequired: "位置情報を選択してください",
    nameRequired: "店名を入力してください",
    photoRequired: "写真を選択してください",
  },
};
