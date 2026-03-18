import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { id: "friends", label: "Amis", icon: faUserGroup },
  { id: "creators", label: "Createurs", icon: faStar },
  { id: "profile", label: "Profil", icon: faUser },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-lg rounded-full shadow-lg px-2 py-1.5 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              {isActive && (
                <span className="text-xs font-semibold">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
