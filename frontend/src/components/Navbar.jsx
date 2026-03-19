import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faStar,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { id: "friends", label: "Amis", icon: faUserGroup },
  { id: "creators", label: "Createurs", icon: faStar },
  { id: "profile", label: "Profil", icon: faUser },
];

export default function Navbar({ activeTab, onTabChange, onPostClick }) {
  const showPostButton = activeTab === "friends";
  const tabRefs = useRef([]);
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

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#9fc031]/15">
      {showPostButton && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={onPostClick}
            className="w-14 h-14 rounded-full bg-[#005b52] text-white shadow-lg shadow-[#005b52]/25 flex items-center justify-center tap-scale hover:shadow-[#005b52]/40 animate-float"
            style={{ "--delay": "0ms" }}
          >
            <FontAwesomeIcon icon={faPlus} className="text-xl" />
          </button>
        </div>
      )}

      <div className="relative flex justify-around items-center py-2 pb-[max(env(safe-area-inset-bottom),1.75rem)]">
        {/* Sliding indicator pill */}
        <div
          className="absolute top-0 h-[3px] bg-[#005b52] rounded-full transition-all duration-350"
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
                isActive ? "text-[#005b52]" : "text-gray-300 hover:text-gray-400"
              }`}
              style={{ transition: "color 0.25s ease" }}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className="text-lg"
                style={{
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
