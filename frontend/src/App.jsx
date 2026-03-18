import { useState } from "react";
import Navbar from "./components/Navbar";
import FriendsPage from "./pages/FriendsPage";
import CreatorsPage from "./pages/CreatorsPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl px-5 py-4 flex items-center justify-center">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-blue-500">bon</span>
          <span className="text-slate-800">app&apos;</span>
        </h1>
      </header>

      {/* Content */}
      <main className="pb-24">
        {activeTab === "friends" && <FriendsPage />}
        {activeTab === "creators" && <CreatorsPage />}
        {activeTab === "calendar" && <CalendarPage />}
        {activeTab === "profile" && <ProfilePage />}
      </main>

      {/* Bottom nav */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
