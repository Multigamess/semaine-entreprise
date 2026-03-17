import { useState } from "react";
import Navbar from "./components/Navbar";
import FriendsPage from "./pages/FriendsPage";
import CreatorsPage from "./pages/CreatorsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">
          bonapp&apos;
        </h1>
      </header>

      {/* Content */}
      <main className="pb-20">
        {activeTab === "friends" && <FriendsPage />}
        {activeTab === "creators" && <CreatorsPage />}
        {activeTab === "profile" && <ProfilePage />}
      </main>

      {/* Bottom nav */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
