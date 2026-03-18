import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../components/PostCard";
import {
  profileUser,
  profilePosts,
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
  const recipesMap = Object.fromEntries(weeklyRecipes.map((r) => [r.id, r]));
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const days = getDaysInMonth(year, month);
  const offset = getFirstDay(year, month);

  function prev() {
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
    setSelectedDay(null);
  }
  function next() {
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
    setSelectedDay(null);
  }

  const selKey = selectedDay ? fmtKey(year, month, selectedDay) : null;
  const selRecipe = selKey ? calendarData[selKey] : null;

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col items-center pt-5 pb-4 px-5">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-18 h-18 rounded-full object-cover"
        />
        <h2 className="mt-3 text-base font-bold text-gray-900">
          {profileUser.name}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">{profileUser.bio}</p>
        <div className="flex gap-8 mt-4">
          {[
            { value: profileUser.stats.plats, label: "Plats" },
            { value: profileUser.stats.amis, label: "Amis" },
            { value: profileUser.stats.semaines, label: "Semaines" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-base font-bold text-gray-900">{stat.value}</span>
              <span className="text-[10px] text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* BeReal Calendar */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400">
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <p className="text-sm font-semibold text-gray-900">{MONTHS[month]} {year}</p>
          <button onClick={next} className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-gray-400">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
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
                className={`aspect-square rounded-lg overflow-hidden relative transition-all ${
                  isSel ? "ring-2 ring-blue-500 ring-offset-1" : ""
                }`}
              >
                {entry ? (
                  <>
                    <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white drop-shadow-md">
                      {day}
                    </span>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <span className="text-[11px] text-gray-300">{day}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selRecipe && (
          <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden">
            <img src={selRecipe.image} alt={selRecipe.recipeName} className="w-full aspect-video object-cover" />
            <div className="p-3">
              <p className="text-[11px] text-blue-500 font-medium">{selectedDay} {MONTHS[month]}</p>
              <p className="text-sm font-bold text-gray-900">{selRecipe.recipeName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* Posts */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">Mes posts</p>
      </div>
      <div>
        {profilePosts.map((post) => (
          <PostCard key={post.id} post={post} recipe={recipesMap[post.recipeId]} />
        ))}
      </div>
    </div>
  );
}
