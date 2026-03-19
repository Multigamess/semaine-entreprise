import { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import CameraOverlay from "./components/CameraOverlay";
import FriendsPage from "./pages/FriendsPage";
import CreatorsPage from "./pages/CreatorsPage";
import ProfilePage from "./pages/ProfilePage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import { creators, profileUser, userWeeklyRealization } from "./data/sampleData";
import { createPost, fetchPosts } from "./lib/posts";

const TABS = ["friends", "creators", "profile"];

function App() {
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("bonapp-dark") === "true"; } catch { return false; }
  });

  const [userPost, setUserPost] = useState(userWeeklyRealization);
  const [hasPosted, setHasPosted] = useState(true);
  const [dbPosts, setDbPosts] = useState([]);

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
  }

  async function handlePublish({ mainImage, selfieImage, caption, recipeId }) {
    // 1. Instant local UI update
    const localPost = {
      id: Date.now(),
      user: { name: "Toi", avatar: profileUser.avatar },
      recipeId,
      mainImage,
      selfieImage,
      caption,
      reactions: [],
      time: "A l'instant",
    };
    setUserPost(localPost);
    setHasPosted(true);
    setShowCamera(false);

    // 2. Persist to Supabase in background
    const savedPost = await createPost({ mainImage, selfieImage, caption, recipeId });
    if (savedPost) {
      // Add to dbPosts so it shows if user reloads
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
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} onPostClick={() => setShowCamera(true)} darkMode={darkMode} />
        {showCamera && <CameraOverlay onClose={() => setShowCamera(false)} onPublish={handlePublish} />}
      </div>
    );
  }

  const translateX = -tabIndex * 100 + (dragX / (window.innerWidth || 393)) * 100;

  const header = (
    <div
      className="backdrop-blur-sm border-b px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-3 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: darkMode ? "var(--header-bg)" : "rgba(255,255,255,0.8)",
        borderColor: darkMode ? "var(--border-color)" : "rgba(0,91,82,0.15)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: darkMode ? "var(--brand)" : "#005b52" }} />
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span style={{ color: darkMode ? "var(--brand)" : "#005b52" }}>bon</span>
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
            <FriendsPage hasPosted={hasPosted} userPost={userPost} dbPosts={dbPosts} onPostClick={() => setShowCamera(true)} />
          </div>
          <div className="w-full h-full flex-shrink-0 overflow-y-auto pb-28">
            {header}
            <CreatorsPage onSelectCreator={handleSelectCreator} />
          </div>
          <div className="w-full h-full flex-shrink-0 overflow-y-auto pb-28">
            {header}
            <ProfilePage darkMode={darkMode} onToggleDark={toggleDarkMode} />
          </div>
        </div>
      </div>

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} onPostClick={() => setShowCamera(true)} darkMode={darkMode} />
      {showCamera && <CameraOverlay onClose={() => setShowCamera(false)} onPublish={handlePublish} />}
    </div>
  );
}

export default App;
