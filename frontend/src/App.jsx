import { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import CameraOverlay from "./components/CameraOverlay";
import FriendsPage from "./pages/FriendsPage";
import CreatorsPage from "./pages/CreatorsPage";
import ProfilePage from "./pages/ProfilePage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import { creators, profileUser } from "./data/sampleData";
import { createPost, fetchPosts } from "./lib/posts";

const TABS = ["friends", "creators", "profile"];

function App() {
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("bonapp-dark") === "true"; } catch { return false; }
  });

  // Sync dark class on #root so portaled overlays inherit dark mode
  useEffect(() => {
    const root = document.getElementById("root");
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const [dbPosts, setDbPosts] = useState([]);

  // Search state — lifted here so Navbar (outside transform) can render the FAB
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Saved/bookmarked recipes — persisted in localStorage
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem("bonapp-saved");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  function toggleSaveRecipe(recipeId) {
    setSavedRecipes((prev) => {
      const next = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      try { localStorage.setItem("bonapp-saved", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function toggleSearch() {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      setSearchOpen(true);
    }
  }

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      try { localStorage.setItem("bonapp-dark", String(next)); } catch {}
      return next;
    });
  }

  // Swipe state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0, locked: null });
  const containerRef = useRef(null);

  const creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c]));
  const tabIndex = TABS.indexOf(activeTab);

  // Load posts from Supabase on mount
  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts.length > 0) setDbPosts(posts);
    });
  }, []);

  function handleSelectCreator(creatorId) { setSelectedCreator(creatorId); }
  function handleBackFromCreator() { setSelectedCreator(null); }

  function handleTabChange(tab) {
    setSelectedCreator(null);
    setActiveTab(tab);
    setDragX(0);
    // Close search when switching tabs
    if (tab !== "creators") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  async function handlePublish({ mainImage, selfieImage, caption, recipeId }) {
    setShowCamera(false);
    // Persist to Supabase in background
    const savedPost = await createPost({ mainImage, selfieImage, caption, recipeId });
    if (savedPost) {
      setDbPosts((prev) => [savedPost, ...prev]);
    }
  }

  // Touch handlers for swiping between pages
  function handleTouchStart(e) {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.locked = null;
    setIsDragging(true);
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;

    // Determine scroll direction lock
    if (touchRef.current.locked === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        touchRef.current.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
    }

    if (touchRef.current.locked === "h") {
      e.preventDefault();
      // Add resistance at edges
      let clampedDx = dx;
      if ((tabIndex === 0 && dx > 0) || (tabIndex === TABS.length - 1 && dx < 0)) {
        clampedDx = dx * 0.3;
      }
      setDragX(clampedDx);
    }
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = window.innerWidth * 0.2;
    if (dragX < -threshold && tabIndex < TABS.length - 1) {
      setActiveTab(TABS[tabIndex + 1]);
    } else if (dragX > threshold && tabIndex > 0) {
      setActiveTab(TABS[tabIndex - 1]);
    }
    setDragX(0);
    touchRef.current.locked = null;
  }

  // Scroll to top when switching tabs
  useEffect(() => {
    if (containerRef.current) {
      const pages = containerRef.current.children;
      if (pages[tabIndex]) {
        pages[tabIndex].scrollTop = 0;
      }
    }
  }, [activeTab]);

  if (selectedCreator && creatorsMap[selectedCreator]) {
    return (
      <div className={`h-full bg-[#FAFBFF] relative flex flex-col overflow-hidden ${darkMode ? "dark" : ""}`} style={{ backgroundColor: darkMode ? "var(--bg-app)" : undefined }}>
        <div className="flex-1 overflow-y-auto pb-28 pt-14">
          <CreatorProfilePage creator={creatorsMap[selectedCreator]} onBack={handleBackFromCreator} />
        </div>
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} onPostClick={() => setShowCamera(true)} darkMode={darkMode} searchOpen={searchOpen} onToggleSearch={toggleSearch} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {showCamera && <CameraOverlay onClose={() => setShowCamera(false)} onPublish={handlePublish} />}
      </div>
    );
  }

  const translateX = -tabIndex * 100 + (dragX / (window.innerWidth || 393)) * 100;

  const header = (
    <div
      className="backdrop-blur-sm border-b px-5 pb-3 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: darkMode ? "var(--header-bg)" : "rgba(255,255,255,0.8)",
        borderColor: darkMode ? "var(--border-color)" : "rgba(134,188,37,0.15)",
        paddingTop: "var(--header-top, 0.75rem)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: darkMode ? "linear-gradient(90deg, transparent, var(--brand), transparent)" : "linear-gradient(90deg, transparent, #86BC25, transparent)" }} />
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span style={{ color: darkMode ? "var(--brand)" : "#86BC25" }}>bon</span>
        <span style={{ color: darkMode ? "var(--text-primary)" : undefined }} className="text-gray-800">app&apos;</span>
      </h1>
    </div>
  );

  return (
    <div className={`h-full bg-[#FAFBFF] relative flex flex-col overflow-hidden ${darkMode ? "dark" : ""}`} style={{ backgroundColor: darkMode ? "var(--bg-app)" : undefined }}>
      {/* Swipeable pages */}
      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={containerRef}
          className="flex h-full"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          <div className="w-full h-full flex-shrink-0 overflow-y-auto pb-28">
            {header}
            <FriendsPage />
          </div>
          <div className="w-full h-full flex-shrink-0 overflow-y-auto pb-28">
            {header}
            <CreatorsPage onSelectCreator={handleSelectCreator} searchQuery={searchQuery} savedRecipes={savedRecipes} onToggleSave={toggleSaveRecipe} />
          </div>
          <div className="w-full h-full flex-shrink-0 overflow-y-auto pb-28">
            {header}
            <ProfilePage darkMode={darkMode} onToggleDark={toggleDarkMode} savedRecipes={savedRecipes} onToggleSave={toggleSaveRecipe} />
          </div>
        </div>
      </div>

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} onPostClick={() => setShowCamera(true)} darkMode={darkMode} searchOpen={searchOpen} onToggleSearch={toggleSearch} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {showCamera && <CameraOverlay onClose={() => setShowCamera(false)} onPublish={handlePublish} />}
    </div>
  );
}

export default App;
