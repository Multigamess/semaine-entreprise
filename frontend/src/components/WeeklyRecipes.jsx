import { useState } from "react";
import RecipeCard from "./RecipeCard";

export default function WeeklyRecipes({ recipes }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  function goTo(index) {
    setCurrent(index);
  }

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < recipes.length - 1) setCurrent(current + 1);
      else if (diff < 0 && current > 0) setCurrent(current - 1);
    }
    setTouchStart(null);
  }

  return (
    <section className="px-5 pt-4 pb-2">
      <h2 className="text-base font-bold text-gray-800 mb-3">
        Tes recettes de la semaine
      </h2>

      {/* Carousel */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {recipes.map((recipe) => (
            <div key={recipe.id} className="w-full flex-shrink-0">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {recipes.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-blue-500"
                : "w-2 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
