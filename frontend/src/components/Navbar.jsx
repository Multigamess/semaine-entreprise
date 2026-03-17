import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { id: "friends", label: "Mes amis", icon: faUserGroup },
  { id: "creators", label: "Createurs", icon: faStar },
  { id: "profile", label: "Profil", icon: faUser },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-xl" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
