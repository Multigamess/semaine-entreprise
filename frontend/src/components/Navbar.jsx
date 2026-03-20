import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faStar,
  faUser,
  faPlus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { id: "friends", label: "Amis", icon: faUserGroup },
  { id: "creators", label: "Createurs", icon: faStar },
  { id: "profile", label: "Profil", icon: faUser },
];

export default function Navbar({ activeTab, onTabChange, onPostClick, darkMode, searchOpen, onToggleSearch, searchQuery, onSearchChange }) {
  const showPostButton = activeTab === "friends";
  const showSearchButton = activeTab === "creators";
  const tabRefs = useRef([]);
  const searchInputRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const idx = tabs.findIndex(t => t.id === activeTab);
    const el = tabRefs.current[idx];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement.getBoundingClientRect();
      setIndicatorStyle({
        left: rect.left - parentRect.left + rect.width / 2 - 10,
        width: 20,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [searchOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    searchInputRef.current?.blur();
  }

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t"
      style={{
        backgroundColor: darkMode ? "rgba(17,19,24,0.88)" : "rgba(255,255,255,0.85)",
        borderColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(134,188,37,0.1)",
        boxShadow: darkMode ? "0 -4px 24px rgba(0,0,0,0.2)" : "0 -4px 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* + button for friends tab */}
      {showPostButton && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={onPostClick}
            className="w-14 h-14 rounded-full bg-[#86BC25] text-white shadow-lg shadow-[#86BC25]/30 flex items-center justify-center tap-scale hover:shadow-[#86BC25]/40"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xl" />
          </button>
        </div>
      )}

      {/* Search FAB for creators tab — smooth scale-in */}
      {showSearchButton && !searchOpen && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={onToggleSearch}
            className="w-14 h-14 rounded-full bg-[#86BC25] text-white shadow-lg shadow-[#86BC25]/30 flex items-center justify-center tap-scale hover:shadow-[#86BC25]/40 animate-scale-in"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
          </button>
        </div>
      )}

      {/* Expanded search bar for creators tab — smooth fade */}
      {showSearchButton && searchOpen && (
        <div className="absolute -top-16 left-0 right-0 px-5 z-50 animate-fade-in-up" style={{ "--delay": "0ms" }}>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSearch}
              className="w-11 h-11 rounded-full bg-[#86BC25] text-white flex items-center justify-center tap-scale flex-shrink-0 shadow-lg animate-scale-in"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
            <div className="flex-1 relative animate-scale-in">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86BC25] text-xs"
              />
              <input
                ref={searchInputRef}
                type="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Recette, createur..."
                className="w-full text-sm text-gray-800 rounded-full pl-9 pr-4 py-2.5 placeholder-gray-400 outline-none shadow-lg border border-[#86BC25]/15 focus:ring-2 focus:ring-[#86BC25]/20"
                style={{ backgroundColor: darkMode ? "var(--bg-card)" : "white", color: darkMode ? "var(--text-primary)" : undefined }}
              />
            </div>
          </form>
        </div>
      )}

      <div className="relative flex justify-around items-center py-2 pb-[max(env(safe-area-inset-bottom),1.75rem)]">
        {/* Sliding indicator pill */}
        <div
          className="absolute top-0 h-[3px] bg-[#86BC25] rounded-full transition-all duration-350"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            transition: "left 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />

        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={el => tabRefs.current[i] = el}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 tap-scale ${
                isActive ? "text-[#86BC25]" : "text-gray-300 hover:text-gray-400"
              }`}
              style={{ transition: "color 0.25s ease" }}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className="text-lg"
                style={{
                  transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
