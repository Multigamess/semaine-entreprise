import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMoon,
  faSun,
  faCheck,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  profileUser,
  calendarData,
} from "../data/sampleData";

const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

/* Get week ranges for a given month */
function getWeeksOfMonth(year, month) {
  const weeks = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let weekStart = 1;

  while (weekStart <= daysInMonth) {
    const startDate = new Date(year, month, weekStart);
    const dayOfWeek = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
    const daysUntilSunday = 6 - dayOfWeek;
    const weekEnd = Math.min(weekStart + daysUntilSunday, daysInMonth);

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

export default function ProfilePage({ darkMode, onToggleDark }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [slideDir, setSlideDir] = useState(null);
  const touchStartX = useRef(null);

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

  let gridAnim = "";
  if (slideDir === "left") gridAnim = "cal-exit-left";
  else if (slideDir === "right") gridAnim = "cal-exit-right";
  else if (slideDir === "enter-left") gridAnim = "cal-enter-left";
  else if (slideDir === "enter-right") gridAnim = "cal-enter-right";

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col items-center pt-5 pb-4 px-5 relative">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center tap-scale"
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

        <div className="stagger-item" style={{ "--stagger": "50ms" }}>
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-18 h-18 rounded-full object-cover shadow-lg"
            style={{
              boxShadow: darkMode
                ? "0 0 0 2px var(--brand), 0 4px 15px var(--shadow-color)"
                : "0 0 0 2px rgba(0,91,82,0.25), 0 4px 15px rgba(0,91,82,0.15)",
            }}
          />
        </div>
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

        {profileUser.streakCount > 0 && (
          <div
            className="mt-4 px-4 py-2 rounded-full inline-flex items-center gap-2 stagger-item"
            style={{
              "--stagger": "350ms",
              background: darkMode
                ? "linear-gradient(to right, rgba(251,191,36,0.1), rgba(245,158,11,0.08))"
                : "linear-gradient(to right, #FFF7ED, #FFFBEB)",
              border: `1px solid ${darkMode ? "rgba(251,191,36,0.15)" : "rgba(251,146,60,0.2)"}`,
            }}
          >
            <span className="text-base animate-float" style={{ "--delay": "0ms" }}>🔥</span>
            <span className="text-xs font-semibold" style={{ color: darkMode ? "#fbbf24" : "#EA580C" }}>
              {profileUser.streakCount} semaines consecutives
            </span>
          </div>
        )}
      </div>

      <div className="mx-5" style={{ borderTop: `1px solid ${darkMode ? "var(--border-color)" : "#F3F4F6"}` }} />

      {/* Weekly Challenge View */}
      <div className="px-5 py-4 stagger-item" style={{ "--stagger": "400ms" }}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => changeMonth(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center tap-scale"
            style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <p className="text-sm font-semibold" style={{ color: darkMode ? "var(--text-primary)" : "#1F2937" }}>
            {MONTHS[month]} {year}
          </p>
          <button
            onClick={() => changeMonth(1)}
            className="w-8 h-8 rounded-full flex items-center justify-center tap-scale"
            style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: darkMode ? "var(--text-muted)" : "#9CA3AF" }}>
              {completedWeeks}/{weeks.length} semaines
            </span>
            <span className="text-[11px] font-semibold" style={{ color: darkMode ? "var(--brand)" : "#005b52" }}>
              {totalRecipes} recette{totalRecipes !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? "var(--bg-surface)" : "#F3F4F6" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${weeks.length > 0 ? (completedWeeks / weeks.length) * 100 : 0}%`,
                backgroundColor: darkMode ? "var(--brand)" : "#005b52",
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
                    border: `1px solid ${hasRecipes ? (darkMode ? "var(--brand-border)" : "rgba(0,91,82,0.15)") : (darkMode ? "var(--border-color)" : "#F3F4F6")}`,
                    backgroundColor: hasRecipes
                      ? (darkMode ? "var(--brand-light)" : "rgba(0,91,82,0.04)")
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
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: darkMode ? "var(--brand)" : "#005b52" }}>
                          {weekRecipes.map((r) => r.recipeName).join(", ")}
                        </p>
                      ) : (
                        <p className="text-[11px] mt-0.5" style={{ color: darkMode ? "var(--text-faint)" : "#D1D5DB" }}>
                          En attente de ta recette...
                        </p>
                      )}
                    </div>

                    {hasRecipes ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: darkMode ? "var(--brand)" : "#005b52" }}>
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
                            <p className="text-[11px] font-medium" style={{ color: darkMode ? "var(--brand)" : "#005b52" }}>
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
                ? "linear-gradient(135deg, rgba(0,168,149,0.15), rgba(0,91,82,0.1))"
                : "linear-gradient(135deg, rgba(0,91,82,0.08), rgba(0,91,82,0.03))",
              border: `1px solid ${darkMode ? "var(--brand-border)" : "rgba(0,91,82,0.15)"}`,
            }}
          >
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-bold mt-1" style={{ color: darkMode ? "var(--brand)" : "#005b52" }}>
              Mois complet !
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: darkMode ? "var(--text-muted)" : "#6B7280" }}>
              Tu as cuisine chaque semaine ce mois-ci
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
