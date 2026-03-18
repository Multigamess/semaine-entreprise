import { useState } from "react";
import Navbar from "./components/Navbar";
import FriendsPage from "./pages/FriendsPage";
import CreatorsPage from "./pages/CreatorsPage";
import ProfilePage from "./pages/ProfilePage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import { creators } from "./data/sampleData";

function App() {
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedCreator, setSelectedCreator] = useState(null);

  const creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c]));

  function handleSelectCreator(creatorId) {
    setSelectedCreator(creatorId);
  }

  function handleBackFromCreator() {
    setSelectedCreator(null);
  }

  // Show creator profile if one is selected
  if (selectedCreator && creatorsMap[selectedCreator]) {
    return (
      <div className="min-h-screen max-w-lg mx-auto relative">
        <CreatorProfilePage
          creator={creatorsMap[selectedCreator]}
          onBack={handleBackFromCreator}
        />
        <Navbar activeTab={activeTab} onTabChange={(tab) => { setSelectedCreator(null); setActiveTab(tab); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-center">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-blue-500">bon</span>
          <span className="text-gray-900">app&apos;</span>
        </h1>
      </header>

      {/* Content */}
      <main className="pb-24">
        {activeTab === "friends" && <FriendsPage />}
        {activeTab === "creators" && <CreatorsPage onSelectCreator={handleSelectCreator} />}
        {activeTab === "profile" && <ProfilePage />}
      </main>

      {/* Bottom nav */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
