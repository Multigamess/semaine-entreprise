import { useState, useRef, useCallback } from "react";
import RecipeCard from "./RecipeCard";

export default function WeeklyRecipes({ recipes }) {
  const [current, setCurrent] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0, locked: null });
  const cardRefs = useRef([]);

  function goTo(index) {
    setFlippedIndex(null);
    setCurrent(index);
  }

  const handleFlip = useCallback((index) => {
    const willFlip = flippedIndex !== index;
    setFlippedIndex(willFlip ? index : null);

    // Scroll back face to top when flipping
    if (willFlip) {
      requestAnimationFrame(() => {
        const card = cardRefs.current[index];
        if (card) {
          const backScroller = card.querySelector(".back-scroll");
          if (backScroller) backScroller.scrollTop = 0;
        }
      });
    }
  }, [flippedIndex]);

  // Swipe handlers with stopPropagation to prevent page-level swipe
  function handleTouchStart(e) {
    e.stopPropagation();
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.locked = null;
    setIsDragging(true);
  }

  function handleTouchMove(e) {
    e.stopPropagation();
    if (!isDragging) return;

    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;

    if (touchRef.current.locked === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        touchRef.current.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
    }

    if (touchRef.current.locked === "h") {
      e.preventDefault();
      // Add resistance at edges
      let clampedDx = dx;
      if ((current === 0 && dx > 0) || (current === recipes.length - 1 && dx < 0)) {
        clampedDx = dx * 0.3;
      }
      setDragX(clampedDx);
    }
  }

  function handleTouchEnd(e) {
    e.stopPropagation();
    if (!isDragging) return;
    setIsDragging(false);

    const containerWidth = 300; // approximate
    const threshold = containerWidth * 0.2;

    if (dragX < -threshold && current < recipes.length - 1) {
      goTo(current + 1);
    } else if (dragX > threshold && current > 0) {
      goTo(current - 1);
    }
    setDragX(0);
    touchRef.current.locked = null;
  }

  const offsetPercent = -current * 100 + (dragX / 3.5);

  return (
    <section className="px-5 pt-5 pb-2">
      <h2 className="text-xl font-extrabold mb-1 text-gray-800">Tes recettes de la semaine</h2>
      <p className="text-xs mb-3 text-gray-400">Choisis, cuisine, partage !</p>

      <div
        className="relative overflow-hidden rounded-[2rem]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${offsetPercent}%)`,
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {recipes.map((recipe, i) => (
            <div key={recipe.id} className="w-full flex-shrink-0" ref={(el) => (cardRefs.current[i] = el)}>
              <RecipeCard recipe={recipe} flipped={flippedIndex === i} onFlip={() => handleFlip(i)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {recipes.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-[#86BC25]" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
