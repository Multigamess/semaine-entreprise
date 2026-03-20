import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faCheck,
  faCamera,
  faBookmark,
  faClock,
  faXmark,
  faDumbbell,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import {
  profileUser,
  calendarData,
  creatorRecipes,
} from "../data/sampleData";

const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

/* Get week ranges for a given month — 7-day chunks */
function getWeeksOfMonth(year, month) {
  const weeks = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let weekStart = 1;

  while (weekStart <= daysInMonth) {
    const weekEnd = Math.min(weekStart + 6, daysInMonth);
    weeks.push({ start: weekStart, end: weekEnd });
    weekStart = weekEnd + 1;
  }

  return weeks;
}

function fmtKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getWeekRecipes(year, month, weekStart, weekEnd) {
  const recipes = [];
  for (let d = weekStart; d <= weekEnd; d++) {
    const key = fmtKey(year, month, d);
    if (calendarData[key]) {
      recipes.push({ day: d, ...calendarData[key] });
    }
  }
  return recipes;
}

/* Compute streak: count consecutive weeks (backwards from current) with at least one recipe */
function computeStreakCount() {
  const today = new Date();
  let y = today.getFullYear();
  let m = today.getMonth();

  // Find which week of the current month we're in
  const weeks = getWeeksOfMonth(y, m);
  let currentWeekIdx = weeks.findIndex((w) => today.getDate() >= w.start && today.getDate() <= w.end);
  if (currentWeekIdx === -1) currentWeekIdx = weeks.length - 1;

  let streak = 0;
  let wi = currentWeekIdx;

  while (true) {
    const monthWeeks = getWeeksOfMonth(y, m);
    if (wi < 0) {
      // Go to previous month
      if (m === 0) { y--; m = 11; } else { m--; }
      wi = getWeeksOfMonth(y, m).length - 1;
      continue;
    }
    const w = monthWeeks[wi];
    if (!w) break;
    const recipes = getWeekRecipes(y, m, w.start, w.end);
    if (recipes.length > 0) {
      streak++;
      wi--;
    } else {
      break;
    }
  }
  return streak;
}

export default function ProfilePage({ darkMode, onToggleDark, savedRecipes = [], onToggleSave }) {
  const recipesMap = Object.fromEntries(creatorRecipes.map((r) => [r.id, r]));
  const savedRecipeList = savedRecipes.map((id) => recipesMap[id]).filter(Boolean);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [slideDir, setSlideDir] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [savedDetail, setSavedDetail] = useState(null);
  const touchStartX = useRef(null);

  const [savedDismissing, setSavedDismissing] = useState(false);
  const savedSheetRef = useRef(null);

  const streakCount = computeStreakCount();
  const weeks = getWeeksOfMonth(year, month);
  const totalRecipes = weeks.reduce(
    (sum, w) => sum + getWeekRecipes(year, month, w.start, w.end).length,
    0
  );
  const completedWeeks = weeks.filter(
    (w) => getWeekRecipes(year, month, w.start, w.end).length > 0
  ).length;

  function changeMonth(delta) {
    setSlideDir(delta > 0 ? "left" : "right");
    setExpandedWeek(null);
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (delta > 0) {
          if (month === 11) { setYear((y) => y + 1); setMonth(0); }
          else setMonth((m) => m + 1);
        } else {
          if (month === 0) { setYear((y) => y - 1); setMonth(11); }
          else setMonth((m) => m - 1);
        }
        setSlideDir((prev) => (prev === "left" ? "enter-left" : "enter-right"));
        setTimeout(() => setSlideDir(null), 280);
      }, 120);
    });
  }

  function handleTouchStart(e) {
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchMove(e) {
    e.stopPropagation();
  }
  function handleTouchEnd(e) {
    e.stopPropagation();
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeMonth(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  }

  function openSavedOverlay() {
    setSavedDetail(null);
    setSavedDismissing(false);
    setShowSaved(true);
  }

  function closeSavedOverlay() {
    setSavedDismissing(true);
    setTimeout(() => { setShowSaved(false); setSavedDismissing(false); setSavedDetail(null); }, 220);
  }

  let gridAnim = "";
  if (slideDir === "left") gridAnim = "cal-exit-left";
  else if (slideDir === "right") gridAnim = "cal-exit-right";
  else if (slideDir === "enter-left") gridAnim = "cal-enter-left";
  else if (slideDir === "enter-right") gridAnim = "cal-enter-right";

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col items-center pt-5 pb-4 px-5 relative">
        {/* Dark mode toggle — top right */}
        <button
          onClick={onToggleDark}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center tap-scale"
          style={{
            backgroundColor: darkMode ? "var(--bg-surface)" : "#F3F4F6",
            border: `1px solid ${darkMode ? "var(--border-color)" : "#E5E7EB"}`,
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <FontAwesomeIcon
            icon={darkMode ? faSun : faMoon}
            className="text-sm"
            style={{
              color: darkMode ? "#fbbf24" : "#6B7280",
              transition: "color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: darkMode ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* Profile pic — clickable, opens saved recipes bubble */}
        <button
          onClick={openSavedOverlay}
          className="stagger-item tap-scale relative"
          style={{ "--stagger": "50ms" }}
        >
          <div
            className="w-20 h-20 rounded-full p-[3px]"
            style={{
              background: savedRecipeList.length > 0
                ? "linear-gradient(135deg, #86BC25, #6aa01d)"
                : (darkMode ? "var(--border-color)" : "rgba(134,188,37,0.3)"),
              transition: "all 0.4s ease",
            }}
          >
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-full h-full rounded-full object-cover border-2"
              style={{ borderColor: darkMode ? "var(--bg-app)" : "white" }}
            />
          </div>
          {savedRecipeList.length > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm animate-scale-in"
              style={{ backgroundColor: "#86BC25" }}
            >
              {savedRecipeList.length}
            </span>
          )}
        </button>
        <h2
          className="mt-3 text-base font-bold stagger-item"
          style={{ "--stagger": "100ms", color: darkMode ? "var(--text-primary)" : undefined }}
        >
          {profileUser.name}
        </h2>
        <p
          className="text-xs mt-0.5 stagger-item"
          style={{ "--stagger": "130ms", color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}
        >
          {profileUser.bio}
        </p>
        <div className="flex gap-8 mt-4 stagger-item" style={{ "--stagger": "180ms" }}>
          {[
            { value: profileUser.stats.plats, label: "Plats" },
            { value: profileUser.stats.amis, label: "Amis" },
            { value: profileUser.stats.semaines, label: "Semaines" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center animate-pop-in"
              style={{ "--delay": `${200 + i * 60}ms` }}
            >
              <span className="text-base font-bold" style={{ color: darkMode ? "var(--text-primary)" : undefined }}>
                {stat.value}
              </span>
              <span className="text-[10px]" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {streakCount > 0 && (
          <div
            className="mt-4 px-4 py-2 rounded-full inline-flex items-center gap-2 stagger-item"
            style={{
              "--stagger": "300ms",
              background: darkMode
                ? "linear-gradient(to right, rgba(134,188,37,0.1), rgba(134,188,37,0.05))"
                : "linear-gradient(to right, rgba(134,188,37,0.08), rgba(134,188,37,0.03))",
              border: `1px solid rgba(134,188,37,0.2)`,
            }}
          >
            <span className="text-sm animate-float" style={{ "--delay": "0ms" }}>🔥</span>
            <span className="text-xs font-semibold" style={{ color: darkMode ? "var(--brand)" : "#5a8c1a" }}>
              {streakCount} semaines
            </span>
          </div>
        )}
      </div>

      <div className="mx-5" style={{ borderTop: `1px solid ${darkMode ? "var(--border-color)" : "#F3F4F6"}` }} />

      {/* Weekly Challenge View */}
      <div className="px-5 py-4 stagger-item" style={{ "--stagger": "400ms" }}>
        <div className="flex items-center justify-center mb-2">
          <p className="text-sm font-semibold" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
            {MONTHS[month]} {year}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
              {completedWeeks}/{weeks.length} semaines
            </span>
            <span className="text-[11px] font-semibold" style={{ color: darkMode ? "var(--brand)" : "#86BC25" }}>
              {totalRecipes} recette{totalRecipes !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? "var(--bg-surface)" : "#F3F4F6" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${weeks.length > 0 ? (completedWeeks / weeks.length) * 100 : 0}%`,
                backgroundColor: darkMode ? "var(--brand)" : "#86BC25",
                transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* Week cards */}
        <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className={`space-y-2.5 ${gridAnim}`}>
            {weeks.map((week, wi) => {
              const weekRecipes = getWeekRecipes(year, month, week.start, week.end);
              const hasRecipes = weekRecipes.length > 0;
              const isExpanded = expandedWeek === wi;

              return (
                <button
                  key={wi}
                  onClick={() => setExpandedWeek(isExpanded ? null : wi)}
                  className="w-full text-left tap-scale week-card"
                  style={{
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: `1px solid ${hasRecipes ? (darkMode ? "var(--brand-border)" : "rgba(134,188,37,0.2)") : (darkMode ? "var(--border-color)" : "#F3F4F6")}`,
                    backgroundColor: hasRecipes
                      ? (darkMode ? "var(--brand-light)" : "rgba(134,188,37,0.04)")
                      : (darkMode ? "var(--bg-surface)" : "#FAFAFA"),
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="flex items-center gap-3 p-3">
                    {hasRecipes ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img src={weekRecipes[0].thumbnail} alt="" className="w-full h-full object-cover" />
                        {weekRecipes.length > 1 && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">+{weekRecipes.length - 1}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: darkMode ? "var(--bg-hover)" : "#F3F4F6",
                          border: `1px dashed ${darkMode ? "var(--text-faint)" : "#D1D5DB"}`,
                        }}
                      >
                        <FontAwesomeIcon icon={faCamera} className="text-xs" style={{ color: darkMode ? "var(--text-faint)" : "#D1D5DB" }} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
                        Semaine {wi + 1}
                        <span className="font-normal ml-1.5" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                          {week.start}-{week.end} {MONTHS[month].slice(0, 3)}
                        </span>
                      </p>
                      {hasRecipes ? (
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: darkMode ? "var(--brand)" : "#86BC25" }}>
                          {weekRecipes.map((r) => r.recipeName).join(", ")}
                        </p>
                      ) : (
                        <p className="text-[11px] mt-0.5" style={{ color: darkMode ? "var(--text-faint)" : "#D1D5DB" }}>
                          En attente de ta recette...
                        </p>
                      )}
                    </div>

                    {hasRecipes ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: darkMode ? "var(--brand)" : "#86BC25" }}>
                        <FontAwesomeIcon icon={faCheck} className="text-white text-[10px]" />
                      </div>
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: darkMode ? "var(--text-faint)" : "#E5E7EB" }}
                      />
                    )}
                  </div>

                  {isExpanded && hasRecipes && (
                    <div className="px-3 pb-3 space-y-2 animate-fade-in-up" style={{ "--delay": "0ms" }}>
                      {weekRecipes.map((recipe, ri) => (
                        <div
                          key={ri}
                          className="flex items-center gap-3 rounded-xl overflow-hidden animate-pop-in"
                          style={{
                            "--delay": `${ri * 60}ms`,
                            backgroundColor: darkMode ? "var(--bg-hover)" : "white",
                            border: `1px solid ${darkMode ? "var(--border-color)" : "#F3F4F6"}`,
                          }}
                        >
                          <img src={recipe.image || recipe.thumbnail} alt={recipe.recipeName} className="w-16 h-16 object-cover flex-shrink-0" />
                          <div className="flex-1 py-2 pr-3">
                            <p className="text-[11px] font-medium" style={{ color: darkMode ? "var(--brand)" : "#86BC25" }}>
                              {recipe.day} {MONTHS[month]}
                            </p>
                            <p className="text-xs font-bold" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
                              {recipe.recipeName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {completedWeeks === weeks.length && weeks.length > 0 && (
          <div
            className="mt-4 p-4 rounded-2xl text-center animate-scale-in"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(134,188,37,0.15), rgba(134,188,37,0.05))"
                : "linear-gradient(135deg, rgba(134,188,37,0.08), rgba(134,188,37,0.03))",
              border: `1px solid ${darkMode ? "var(--brand-border)" : "rgba(134,188,37,0.2)"}`,
            }}
          >
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-bold mt-1" style={{ color: darkMode ? "var(--brand)" : "#86BC25" }}>
              Mois complet !
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: darkMode ? "var(--text-muted)" : "#6B7280" }}>
              Tu as cuisine chaque semaine ce mois-ci
            </p>
          </div>
        )}
      </div>

      {/* Saved Recipes — centered bubble modal with blur backdrop */}
      {showSaved && createPortal(
        <div
          className={`absolute inset-0 z-[100] flex items-center justify-center p-6 ${savedDismissing ? "animate-bubble-out" : "animate-bubble-in"}`}
          onClick={closeSavedOverlay}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            backgroundColor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)",
          }}
        >
          <div
            ref={savedSheetRef}
            className={`relative w-full max-h-[70vh] overflow-y-auto rounded-3xl p-5 pb-6 shadow-2xl ${savedDismissing ? "" : "animate-scale-in"}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: darkMode ? "var(--bg-card)" : "white",
              border: `1px solid ${darkMode ? "var(--border-color)" : "rgba(134,188,37,0.15)"}`,
            }}
          >
            <button
              onClick={closeSavedOverlay}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center tap-scale"
              style={{
                backgroundColor: darkMode ? "var(--bg-surface)" : "#F3F4F6",
                border: `1px solid ${darkMode ? "var(--border-color)" : "#E5E7EB"}`,
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faBookmark} className="text-xs" style={{ color: "#86BC25" }} />
              <p className="text-sm font-bold" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
                Mes recettes
              </p>
              {savedRecipeList.length > 0 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(134,188,37,0.1)", color: "#86BC25" }}>
                  {savedRecipeList.length}
                </span>
              )}
            </div>

            {/* Detail view of a selected saved recipe */}
            {savedDetail ? (
              <div className="animate-fade-in-up" style={{ "--delay": "0ms" }}>
                <button
                  onClick={() => setSavedDetail(null)}
                  className="flex items-center gap-1.5 text-xs font-medium mb-3 tap-scale"
                  style={{ color: "#86BC25" }}
                >
                  ← Retour
                </button>
                <img src={savedDetail.image} alt={savedDetail.name} className="w-full h-36 object-cover rounded-xl mb-3 animate-img-reveal" />
                <h3 className="text-base font-bold mb-2" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>{savedDetail.name}</h3>

                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />{savedDetail.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                    <FontAwesomeIcon icon={faDumbbell} className="text-[10px]" />{savedDetail.difficulty}
                  </span>
                  {savedDetail.nutriscore && (
                    <span className={`nutriscore-${savedDetail.nutriscore} text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center`}>
                      {savedDetail.nutriscore}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {savedDetail.tags.map((tag, i) => (
                    <span key={tag} className="bg-[#86BC25]/10 text-[#86BC25] border border-[#86BC25]/20 text-[10px] font-medium px-2 py-0.5 rounded-full animate-pop-in" style={{ "--delay": `${i * 40}ms` }}>{tag}</span>
                  ))}
                </div>

                <p className="text-xs font-semibold mb-1.5" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>Ingredients</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {savedDetail.ingredients.map((ing, i) => (
                    <span key={ing} className="text-[10px] px-2 py-0.5 rounded-full animate-pop-in" style={{ "--delay": `${100 + i * 30}ms`, backgroundColor: darkMode ? "var(--bg-surface)" : "#F9FAFB", color: darkMode ? "var(--text-secondary)" : "#4B5563" }}>{ing}</span>
                  ))}
                </div>

                {savedDetail.steps && savedDetail.steps.length > 0 && (
                  <>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>Etapes</p>
                    <div className="space-y-1.5">
                      {savedDetail.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 animate-pop-in" style={{ "--delay": `${200 + i * 50}ms` }}>
                          <div className="w-5 h-5 rounded-full bg-[#86BC25] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-[9px] font-bold">{i + 1}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: darkMode ? "var(--text-secondary)" : "#4B5563" }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* List of saved recipes */
              savedRecipeList.length === 0 ? (
                <div className="py-8 text-center animate-fade-in-up" style={{ "--delay": "50ms" }}>
                  <span className="text-3xl block mb-2">📌</span>
                  <p className="text-sm font-medium" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>Aucune recette sauvegardee</p>
                  <p className="text-[11px] mt-1" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>Sauvegarde des recettes depuis le feed createurs</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedRecipeList.map((recipe, i) => (
                    <button
                      key={recipe.id}
                      onClick={() => setSavedDetail(recipe)}
                      className="w-full flex items-center gap-3 rounded-2xl overflow-hidden text-left tap-scale animate-pop-in"
                      style={{
                        "--delay": `${i * 60}ms`,
                        backgroundColor: darkMode ? "var(--bg-surface)" : "#FAFAFA",
                        border: `1px solid ${darkMode ? "var(--border-color)" : "#F3F4F6"}`,
                      }}
                    >
                      <img src={recipe.image} alt={recipe.name} className="w-14 h-14 object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0 py-2">
                        <p className="text-xs font-bold truncate" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
                          {recipe.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                            <FontAwesomeIcon icon={faClock} className="text-[8px]" />{recipe.time}
                          </span>
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
                            <FontAwesomeIcon icon={faDumbbell} className="text-[8px]" />{recipe.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="pr-3">
                        <FontAwesomeIcon icon={faUtensils} className="text-[10px]" style={{ color: "#86BC25" }} />
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>,
        document.getElementById('root')
      )}
    </div>
  );
}
