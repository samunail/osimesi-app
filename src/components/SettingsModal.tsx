import React from "react";
import { Settings, Theme, Language } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4 dark:text-white">設定</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 dark:text-white">テーマ</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onSettingsChange({ ...settings, theme: "light" })}
              className={`px-3 py-1 rounded ${
                settings.theme === "light"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              ライト
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, theme: "dark" })}
              className={`px-3 py-1 rounded ${
                settings.theme === "dark"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              ダーク
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 dark:text-white">言語</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onSettingsChange({ ...settings, language: "ja" })}
              className={`px-3 py-1 rounded ${
                settings.language === "ja"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              日本語
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, language: "en" })}
              className={`px-3 py-1 rounded ${
                settings.language === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
