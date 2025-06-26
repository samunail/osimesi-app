import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  okLabel: string;
  cancelLabel: string;
  darkMode?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  okLabel,
  cancelLabel,
  darkMode = false,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm mx-4`}
      >
        <div className="mb-6 text-center text-lg text-gray-900 dark:text-gray-100">
          {message}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
