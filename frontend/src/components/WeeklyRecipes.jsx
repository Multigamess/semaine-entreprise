import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import RecipeCard from "./RecipeCard";

export default function WeeklyRecipes({ recipes }) {
  const [current, setCurrent] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);

  function goTo(index) {
    setFlippedIndex(null);
    setCurrent(index);
  }

  function handleFlip(index) {
    setFlippedIndex(flippedIndex === index ? null : index);
  }

  return (
    <section className="px-5 pt-5 pb-2">
      <h2 className="text-xl font-extrabold mb-1 text-gray-800">Tes recettes de la semaine</h2>
      <p className="text-xs mb-3 text-gray-400">Choisis, cuisine, partage !</p>

      <div className="relative">
        <div className="overflow-hidden rounded-[2rem]">
          <div
            className="flex"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {recipes.map((recipe, i) => (
              <div key={recipe.id} className="w-full flex-shrink-0">
                <RecipeCard recipe={recipe} flipped={flippedIndex === i} onFlip={() => handleFlip(i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {current > 0 && (
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center tap-scale z-10"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs text-gray-600" />
          </button>
        )}
        {current < recipes.length - 1 && (
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center tap-scale z-10"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {recipes.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-[#005b52]" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
