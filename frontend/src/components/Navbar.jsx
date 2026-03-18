import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faStar,
  faCalendarDays,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { id: "friends", label: "Amis", icon: faUserGroup },
  { id: "creators", label: "Createurs", icon: faStar },
  { id: "calendar", label: "Calendrier", icon: faCalendarDays },
  { id: "profile", label: "Profil", icon: faUser },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
      <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-lg rounded-full shadow-sm px-1.5 py-1.5 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              {isActive && (
                <span className="text-[11px] font-semibold">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
