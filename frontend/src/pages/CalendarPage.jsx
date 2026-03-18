import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { calendarData } from "../data/sampleData";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function prevMonth() {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
    setSelectedDay(null);
  }

  const selectedKey = selectedDay ? formatKey(year, month, selectedDay) : null;
  const selectedRecipe = selectedKey ? calendarData[selectedKey] : null;

  const todayKey = formatKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="px-5 pt-4 pb-8">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
        </button>
        <h2 className="text-base font-bold text-slate-800">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-slate-400">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = formatKey(year, month, day);
          const hasRecipe = !!calendarData[key];
          const isSelected = selectedDay === day;
          const isToday = key === todayKey;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-all ${
                isSelected
                  ? "bg-blue-500 text-white font-bold"
                  : isToday
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-white"
              }`}
            >
              {day}
              {hasRecipe && (
                <div
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 ${
                    isSelected ? "bg-white" : "bg-amber-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedRecipe && (
        <div className="mt-5 bg-white rounded-2xl overflow-hidden">
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.recipeName}
            className="w-full aspect-video object-cover"
          />
          <div className="p-4">
            <p className="text-xs text-blue-500 font-semibold mb-0.5">
              {selectedDay} {MONTHS[month]}
            </p>
            <h3 className="text-base font-bold text-slate-800">
              {selectedRecipe.recipeName}
            </h3>
          </div>
        </div>
      )}

      {selectedDay && !selectedRecipe && (
        <div className="mt-5 bg-white rounded-2xl p-6 text-center">
          <p className="text-slate-400 text-sm">Pas de recette ce jour-la</p>
        </div>
      )}
    </div>
  );
}
