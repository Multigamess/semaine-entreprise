import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  profileUser,
  weeklyRecipes,
  calendarData,
} from "../data/sampleData";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function fmtKey(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

export default function ProfilePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [slideDir, setSlideDir] = useState(null);
  const touchStartX = useRef(null);

  const days = getDaysInMonth(year, month);
  const offset = getFirstDay(year, month);

  function changeMonth(delta) {
    setSlideDir(delta > 0 ? "left" : "right");
    setSelectedDay(null);
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (delta > 0) {
          if (month === 11) { setYear(y => y + 1); setMonth(0); }
          else setMonth(m => m + 1);
        } else {
          if (month === 0) { setYear(y => y - 1); setMonth(11); }
          else setMonth(m => m - 1);
        }
        setSlideDir(prev => prev === "left" ? "enter-left" : "enter-right");
        setTimeout(() => setSlideDir(null), 280);
      }, 120);
    });
  }

  function handleTouchStart(e) {
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchMove(e) {
    // Stop page-swipe from stealing the gesture
    e.stopPropagation();
  }
  function handleTouchEnd(e) {
    e.stopPropagation();
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeMonth(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const selKey = selectedDay ? fmtKey(year, month, selectedDay) : null;
  const selRecipe = selKey ? calendarData[selKey] : null;

  let gridAnim = "";
  if (slideDir === "left") gridAnim = "cal-exit-left";
  else if (slideDir === "right") gridAnim = "cal-exit-right";
  else if (slideDir === "enter-left") gridAnim = "cal-enter-left";
  else if (slideDir === "enter-right") gridAnim = "cal-enter-right";

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col items-center pt-5 pb-4 px-5">
        <div className="stagger-item" style={{ "--stagger": "50ms" }}>
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-18 h-18 rounded-full object-cover ring-2 ring-[#005b52]/25 shadow-lg shadow-[#005b52]/15"
          />
        </div>
        <h2 className="mt-3 text-base font-bold text-gray-800 stagger-item" style={{ "--stagger": "100ms" }}>{profileUser.name}</h2>
        <p className="text-xs mt-0.5 text-gray-400 stagger-item" style={{ "--stagger": "130ms" }}>{profileUser.bio}</p>
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
              <span className="text-base font-bold text-gray-800">{stat.value}</span>
              <span className="text-[10px] text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {profileUser.streakCount > 0 && (
          <div
            className="mt-4 px-4 py-2 rounded-full inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/50 stagger-item"
            style={{ "--stagger": "350ms" }}
          >
            <span className="text-base animate-float" style={{ "--delay": "0ms" }}>🔥</span>
            <span className="text-xs font-semibold text-orange-600">
              {profileUser.streakCount} semaines consecutives
            </span>
          </div>
        )}
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* Calendar */}
      <div className="px-5 py-4 stagger-item" style={{ "--stagger": "400ms" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full flex items-center justify-center tap-scale text-gray-400 hover:bg-gray-50 active:bg-gray-100">
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <p
            className="text-sm font-semibold text-gray-800"
            style={{ transition: "opacity 0.2s ease" }}
          >
            {MONTHS[month]} {year}
          </p>
          <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full flex items-center justify-center tap-scale text-gray-400 hover:bg-gray-50 active:bg-gray-100">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-gray-400">{d}</div>
          ))}
        </div>

        <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className={`grid grid-cols-7 gap-1 ${gridAnim}`}>
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`e-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const key = fmtKey(year, month, day);
              const entry = calendarData[key];
              const isSel = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSel ? null : day)}
                  className={`aspect-square rounded-lg overflow-hidden relative tap-scale ${
                    isSel ? "ring-2 ring-[#005b52] ring-offset-1" : ""
                  }`}
                  style={{
                    transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease",
                    transform: isSel ? "scale(0.92)" : "scale(1)",
                  }}
                >
                  {entry ? (
                    <>
                      <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white drop-shadow-md">{day}</span>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className="text-[11px] text-gray-300">{day}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selRecipe && (
          <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden animate-scale-in shadow-sm">
            <img src={selRecipe.image} alt={selRecipe.recipeName} className="w-full aspect-video object-cover animate-img-reveal" />
            <div className="p-3">
              <p className="text-[11px] text-[#005b52] font-medium">{selectedDay} {MONTHS[month]}</p>
              <p className="text-sm font-bold text-gray-800">{selRecipe.recipeName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
