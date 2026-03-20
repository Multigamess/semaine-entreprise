import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUtensils,
  faXmark,
  faClock,
  faDumbbell,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkOutline } from "@fortawesome/free-regular-svg-icons";
import { creators, creatorFeedPosts, creatorRecipes } from "../data/sampleData";

const TYPE_LABELS = { chef: "Chef", influenceur: "Influenceur", restaurateur: "Restaurateur" };

const COOKING_REACTIONS = [
  { emoji: "😋", label: "Miam" },
  { emoji: "🔥", label: "Chaud" },
  { emoji: "👨‍🍳", label: "Chef" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "💪", label: "Proteine" },
];

function CreatorPost({ post, creator, recipe, onRecipeClick, onSelectCreator, isSaved, onToggleSave }) {
  const [selected, setSelected] = useState(null);
  const [bouncing, setBouncing] = useState(null);
  const [floatingEmoji, setFloatingEmoji] = useState(null);
  const [counts] = useState(() =>
    COOKING_REACTIONS.map(() => Math.floor(post.likes / COOKING_REACTIONS.length) + Math.floor(Math.random() * 5))
  );

  function handleTap(i) {
    const wasActive = selected === i;
    if (wasActive) {
      setSelected(null);
    } else {
      setSelected(i);
      setBouncing(i);
      setFloatingEmoji(COOKING_REACTIONS[i].emoji);
      setTimeout(() => setBouncing(null), 400);
      setTimeout(() => setFloatingEmoji(null), 900);
    }
  }

  return (
    <article className="px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => onSelectCreator(creator.id)} className="flex items-center gap-3 flex-1 text-left tap-scale">
          <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#86BC25]/15" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-800">{creator.name}</p>
              {creator.verified && <FontAwesomeIcon icon={faCheckCircle} className="text-[#86BC25] text-[10px]" />}
            </div>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: creator.theme.secondary, color: creator.theme.primary }}
            >
              {TYPE_LABELS[creator.type]}
            </span>
          </div>
        </button>
        {recipe && (
          <button
            onClick={() => onRecipeClick(post.recipeId)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tap-scale text-[#86BC25] border border-[#86BC25]/30 hover:bg-[#86BC25]/10"
          >
            <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
            Recette
          </button>
        )}
      </div>

      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50">
        <img src={post.image} alt="" className="w-full h-full object-cover" />

        {floatingEmoji && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl animate-heart-burst drop-shadow-lg">{floatingEmoji}</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-1.5">
          {COOKING_REACTIONS.map((r, i) => {
            const isActive = selected === i;
            const count = counts[i] + (isActive ? 1 : 0);
            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                className={`flex items-center gap-1 rounded-full px-2 py-1 tap-scale ${
                  isActive
                    ? "bg-[#86BC25]/10 border border-[#86BC25]/30"
                    : "bg-gray-50 border border-transparent"
                }`}
                style={{ transition: "background-color 0.25s ease, border-color 0.25s ease" }}
              >
                <span className={`text-sm ${bouncing === i ? "animate-emoji-bounce" : ""}`}>{r.emoji}</span>
                <span
                  className={`text-[11px] font-medium ${isActive ? "text-[#86BC25]" : "text-gray-400"}`}
                  style={{ transition: "color 0.2s ease" }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {recipe && (
            <button
              onClick={() => onToggleSave(post.recipeId)}
              className="ml-auto tap-scale"
              style={{ transition: "transform 0.2s ease" }}
            >
              <FontAwesomeIcon
                icon={isSaved ? faBookmark : faBookmarkOutline}
                className={`text-base ${isSaved ? "text-[#86BC25] animate-pop-in" : "text-gray-300"}`}
                style={{ "--delay": "0ms", transition: "color 0.25s ease" }}
              />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">{post.caption}</p>
    </article>
  );
}

export default function CreatorsPage({ onSelectCreator, searchQuery = "", savedRecipes = [], onToggleSave }) {
  const creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c]));
  const recipesMap = Object.fromEntries(creatorRecipes.map((r) => [r.id, r]));
  const [showRecipe, setShowRecipe] = useState(null);

  /* Swipe-down-to-dismiss */
  const [sheetDragY, setSheetDragY] = useState(0);
  const [sheetDismissing, setSheetDismissing] = useState(false);
  const [sheetAnimated, setSheetAnimated] = useState(false);
  const sheetTouch = useRef({ startY: 0, dragging: false });
  const sheetRef = useRef(null);

  function sheetTouchStart(e) {
    e.stopPropagation();
    const el = sheetRef.current;
    if (el && el.scrollTop <= 0) {
      sheetTouch.current.startY = e.touches[0].clientY;
      sheetTouch.current.dragging = true;
    }
  }
  function sheetTouchMove(e) {
    e.stopPropagation();
    if (!sheetTouch.current.dragging) return;
    const dy = e.touches[0].clientY - sheetTouch.current.startY;
    if (dy > 0) {
      e.preventDefault();
      setSheetDragY(dy);
    }
  }
  function sheetTouchEnd(e) {
    e.stopPropagation();
    if (!sheetTouch.current.dragging) return;
    sheetTouch.current.dragging = false;
    if (sheetDragY > 100) {
      setSheetDismissing(true);
      setTimeout(() => { setShowRecipe(null); setSheetDragY(0); setSheetDismissing(false); setSheetAnimated(false); }, 250);
    } else {
      setSheetDragY(0);
    }
  }

  function openRecipe(id) {
    setSheetAnimated(false);
    setShowRecipe(id);
  }

  const activeRecipe = showRecipe ? recipesMap[showRecipe] : null;

  // Filter posts based on search query from parent
  const filteredPosts = searchQuery.trim()
    ? creatorFeedPosts.filter((post) => {
        const creator = creatorsMap[post.creatorId];
        const recipe = post.recipeId ? recipesMap[post.recipeId] : null;
        const q = searchQuery.toLowerCase();
        return (
          (creator && creator.name.toLowerCase().includes(q)) ||
          (recipe && recipe.name.toLowerCase().includes(q)) ||
          (recipe && recipe.tags.some((t) => t.toLowerCase().includes(q))) ||
          post.caption.toLowerCase().includes(q)
        );
      })
    : creatorFeedPosts;

  // Determine animation class for sheet
  let sheetAnim = "";
  if (sheetDismissing) sheetAnim = "animate-slide-down";
  else if (!sheetAnimated && sheetDragY === 0) sheetAnim = "animate-slide-up";

  return (
    <div>
      {/* Search results count */}
      {searchQuery && (
        <div className="px-5 pt-3 pb-1">
          <p className="text-[11px] text-gray-400 animate-fade-in-up" style={{ "--delay": "0ms" }}>
            {filteredPosts.length} resultat{filteredPosts.length !== 1 ? "s" : ""} pour &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}

      <div>
        {filteredPosts.map((post, postIndex) => {
          const creator = creatorsMap[post.creatorId];
          if (!creator) return null;
          const recipe = post.recipeId ? recipesMap[post.recipeId] : null;

          return (
            <div key={post.id} className="stagger-item" style={{ "--stagger": `${postIndex * 120}ms` }}>
              <CreatorPost
                post={post}
                creator={creator}
                recipe={recipe}
                onRecipeClick={openRecipe}
                onSelectCreator={onSelectCreator}
                isSaved={post.recipeId ? savedRecipes.includes(post.recipeId) : false}
                onToggleSave={onToggleSave}
              />
            </div>
          );
        })}

        {filteredPosts.length === 0 && searchQuery && (
          <div className="px-5 py-16 text-center animate-fade-in-up" style={{ "--delay": "0ms" }}>
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-sm font-semibold text-gray-800">Aucun resultat</p>
            <p className="text-xs text-gray-400 mt-1">Essaie un autre mot-cle</p>
          </div>
        )}
      </div>

      {/* Recipe overlay — portaled to #root to stay within phone frame */}
      {activeRecipe && createPortal(
        <div
          className="absolute inset-0 z-[100] bg-black/30 flex items-end justify-center animate-backdrop"
          onClick={() => { setShowRecipe(null); setSheetAnimated(false); }}
          style={{ opacity: sheetDragY > 0 ? Math.max(0.2, 1 - sheetDragY / 400) : undefined }}
        >
          <div
            ref={sheetRef}
            className={`relative bg-white w-full rounded-t-[1.5rem] p-6 pb-10 max-h-[85vh] overflow-y-auto ${sheetAnim}`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={sheetTouchStart}
            onTouchMove={sheetTouchMove}
            onTouchEnd={sheetTouchEnd}
            onAnimationEnd={() => { if (!sheetDismissing) setSheetAnimated(true); }}
            style={{
              transform: sheetDragY > 0 && !sheetDismissing ? `translateY(${sheetDragY}px)` : undefined,
              transition: sheetDragY > 0 ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-200 cursor-grab" />

            <button onClick={() => { setShowRecipe(null); setSheetAnimated(false); }} className="absolute top-4 right-4 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center tap-scale">
              <FontAwesomeIcon icon={faXmark} className="text-sm text-gray-400" />
            </button>

            <p className="text-[11px] text-[#86BC25] font-medium uppercase tracking-wider mb-1">Recette du createur</p>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{activeRecipe.name}</h3>

            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <FontAwesomeIcon icon={faClock} className="text-xs" />{activeRecipe.time}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <FontAwesomeIcon icon={faDumbbell} className="text-xs" />{activeRecipe.difficulty}
              </span>
              {activeRecipe.nutriscore && (
                <span className={`nutriscore-${activeRecipe.nutriscore} text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center`}>
                  {activeRecipe.nutriscore}
                </span>
              )}
              {activeRecipe.calories && (
                <span className="text-xs text-gray-400 font-medium">{activeRecipe.calories} kcal</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeRecipe.tags.map((tag, i) => (
                <span key={tag} className="bg-[#86BC25]/10 text-[#86BC25] border border-[#86BC25]/20 text-xs font-medium px-2.5 py-1 rounded-full animate-pop-in" style={{ "--delay": `${i * 40}ms` }}>{tag}</span>
              ))}
            </div>

            <p className="text-sm font-semibold mb-2 text-gray-800">Ingredients</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeRecipe.ingredients.map((ing, i) => (
                <span key={ing} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full animate-pop-in" style={{ "--delay": `${100 + i * 30}ms` }}>{ing}</span>
              ))}
            </div>

            {activeRecipe.steps && activeRecipe.steps.length > 0 && (
              <>
                <p className="text-sm font-semibold mb-2 text-gray-800">Etapes</p>
                <div className="space-y-2 mb-4">
                  {activeRecipe.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 animate-pop-in" style={{ "--delay": `${200 + i * 50}ms` }}>
                      <div className="w-6 h-6 rounded-full bg-[#86BC25] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <img src={activeRecipe.image} alt={activeRecipe.name} className="w-full h-36 object-cover rounded-xl animate-img-reveal" />
          </div>
        </div>,
        document.getElementById('root')
      )}
    </div>
  );
}
