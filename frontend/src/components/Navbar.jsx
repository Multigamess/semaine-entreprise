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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors duration-200 ${
                isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-lg" />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-500 -mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
