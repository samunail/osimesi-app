# 推し飯アプリ 仕様書

## 1. アプリケーション概要

「推し飯」は、ユーザーがお気に入りの飲食店を地図上に登録し、店舗情報を管理できるシンプルな Web アプリケーションです。

## 2. 主要機能

### 2.1 推し飯の新規登録

- 店名（必須）
- 写真（必須）
- メモ（任意）
- 位置情報（必須）
  - 現在地から選択
  - 地図上で任意の位置を選択
- 登録日時（自動記録）

### 2.2 地図表示機能

- 登録された推し飯を地図上にピン表示
- ピンクリック時の情報表示
  - 店名
  - 写真
  - メモ
  - 登録日時

### 2.3 一覧表示機能

- 登録された推し飯をカード形式で表示
- 各カードに表示する情報
  - 店名
  - サムネイル写真
  - 登録日時
  - 地図表示へのリンク

## 3. 技術スタック

### 3.1 フロントエンド

- React 18
- TypeScript
- スタイリング: Tailwind CSS

### 3.2 地図機能

- OpenStreetMap + Leaflet
  - 理由：無料で利用可能、カスタマイズ性が高い

### 3.3 データ管理

- ローカルストレージ（localStorage）
  - 店舗情報の永続化
  - 画像データは Base64 形式で保存

## 4. データ構造

### 4.1 店舗情報（Restaurant）

```typescript
interface Restaurant {
  id: string; // ユニークID
  name: string; // 店名
  photo: string; // Base64形式の画像データ
  memo: string; // メモ
  location: {
    // 位置情報
    lat: number; // 緯度
    lng: number; // 経度
  };
  createdAt: string; // 登録日時（ISO形式）
}
```

## 5. 画面構成

### 5.1 メインページ

- 地図表示エリア
- 新規登録ボタン
- 一覧表示切り替えボタン

### 5.2 新規登録モーダル

- 店名入力フォーム
- 写真アップロードエリア
- メモ入力エリア
- 位置情報選択エリア
- 登録ボタン

### 5.3 店舗詳細モーダル

- 店名
- 写真
- メモ
- 登録日時
- 地図表示へのリンク

## 6. 今後の拡張性

- カテゴリー分類機能
- 評価機能（星評価）
- 検索機能
- フィルタリング機能
- バックエンド連携
- クラウドストレージでの画像保存

## 7. 開発環境セットアップ

1. Node.js v18 以上
2. npm または yarn
3. 必要なパッケージ
   - react
   - react-dom
   - typescript
   - @types/react
   - @types/react-dom
   - leaflet
   - @types/leaflet
   - tailwindcss
   - @heroicons/react
