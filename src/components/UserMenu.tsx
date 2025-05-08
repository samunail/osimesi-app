import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface UserMenuProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSettingsOpen: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  onOpen,
  onClose,
  onSettingsOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menu = isOpen ? (
    <div
      ref={menuRef}
      className="fixed z-[2147483647] w-56 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        top: "88px",
        right: "32px",
      }}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        onClick={onClose}
      >
        ログイン
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        onClick={onClose}
      >
        フレンド
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        onClick={() => {
          onSettingsOpen();
          onClose();
        }}
      >
        設定
      </button>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={isOpen ? onClose : onOpen}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        aria-label="ユーザーメニュー"
      >
        {/* 人型アイコン（将来的に画像に差し替え可能） */}
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      </button>
      {isOpen && createPortal(menu, document.body)}
    </>
  );
};

export default UserMenu;
