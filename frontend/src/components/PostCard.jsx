import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUtensils,
  faXmark,
  faClock,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";

const COOKING_REACTIONS = [
  { emoji: "😋", label: "Miam" },
  { emoji: "🔥", label: "Chaud" },
  { emoji: "👨‍🍳", label: "Chef" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "💪", label: "Proteine" },
];

function initCounts(postReactions) {
  const reactions = Array.isArray(postReactions) ? postReactions : [];
  return COOKING_REACTIONS.map((r) => {
    const match = reactions.find((pr) => pr.emoji === r.emoji);
    return match ? match.count : Math.floor(Math.random() * 8) + 1;
  });
}

export default function PostCard({ post, recipe, blurred = false, style }) {
  const [showSelfie, setShowSelfie] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [bouncingEmoji, setBouncingEmoji] = useState(null);
  const [counts] = useState(() => initCounts(post.reactions));
  const lastTap = useRef(0);

  function handlePhotoTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (selectedReaction === null) {
        setSelectedReaction(0);
        setBouncingEmoji(0);
        setTimeout(() => setBouncingEmoji(null), 500);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    } else {
      setShowSelfie(!showSelfie);
    }
    lastTap.current = now;
  }

  function handleReactionTap(index) {
    const wasActive = selectedReaction === index;
    setSelectedReaction(wasActive ? null : index);
    if (!wasActive) {
      setBouncingEmoji(index);
      setTimeout(() => setBouncingEmoji(null), 500);
    }
  }

  return (
    <>
      <article className="px-5 py-4 stagger-item" style={style}>
        {/* User header */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#005b52]/25"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{post.user.name}</p>
            <p className="text-[11px] text-gray-400">{post.time}</p>
          </div>
          {recipe && (
            <button
              onClick={() => setShowRecipe(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tap-scale text-[#005b52] border border-[#005b52]/30 hover:bg-[#005b52]/10"
            >
              <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
              Recette
            </button>
          )}
        </div>

        {/* Dual camera photo */}
        <div
          className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 cursor-pointer"
          onClick={blurred ? undefined : handlePhotoTap}
        >
          {/* Main image with smooth crossfade */}
          <img
            src={showSelfie ? post.selfieImage : post.mainImage}
            alt="Plat"
            className={`w-full h-full object-cover ${blurred ? "blur-[12px] scale-105" : ""}`}
            style={{ transition: "filter 0.4s ease, transform 0.4s ease" }}
          />
          {/* Mini PIP with smooth transition */}
          <div
            className={`absolute top-3 left-3 w-[26%] aspect-square rounded-xl overflow-hidden border-2 border-white shadow-lg ${blurred ? "blur-[12px]" : ""}`}
            style={{ transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <img
              src={showSelfie ? post.mainImage : post.selfieImage}
              alt="Selfie"
              className="w-full h-full object-cover"
            />
          </div>

          {!blurred && (
            <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white/30 tracking-tight select-none">
              bonapp&apos;
            </span>
          )}

          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <FontAwesomeIcon icon={faHeart} className="text-white text-6xl animate-heart-burst drop-shadow-lg" />
            </div>
          )}

          {blurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-gentle-pulse">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          )}
        </div>

        {/* Reactions + caption */}
        {!blurred && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              {COOKING_REACTIONS.map((r, i) => {
                const isActive = selectedReaction === i;
                const isBouncing = bouncingEmoji === i;
                const count = counts[i] + (isActive ? 1 : 0);
                return (
                  <button
                    key={i}
                    onClick={() => handleReactionTap(i)}
                    className={`flex items-center gap-1 rounded-full px-2 py-1 tap-scale ${
                      isActive
                        ? "bg-[#005b52]/10 border border-[#005b52]/30"
                        : "bg-gray-50 border border-transparent hover:border-gray-200"
                    }`}
                    style={{ transition: "background-color 0.25s ease, border-color 0.25s ease" }}
                  >
                    <span className={`text-sm ${isBouncing ? "animate-emoji-bounce" : ""}`}>{r.emoji}</span>
                    <span
                      className={`text-[11px] font-medium ${isActive ? "text-[#005b52]" : "text-gray-400"}`}
                      style={{ transition: "color 0.2s ease" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {post.caption}
            </p>
          </div>
        )}
      </article>

      {/* Recipe overlay */}
      {showRecipe && recipe && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 flex items-end justify-center animate-backdrop"
          onClick={() => setShowRecipe(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-[1.5rem] p-6 pb-10 animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-200" />

            <button
              onClick={() => setShowRecipe(false)}
              className="absolute top-6 right-6 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center tap-scale"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm text-gray-400" />
            </button>

            <p className="text-[11px] text-[#005b52] font-medium uppercase tracking-wider mb-1">Recette</p>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{recipe.name}</h3>

            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <FontAwesomeIcon icon={faClock} className="text-xs" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <FontAwesomeIcon icon={faDumbbell} className="text-xs" />
                {recipe.difficulty}
              </span>
              {recipe.nutriscore && (
                <span className={`nutriscore-${recipe.nutriscore} text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center`}>
                  {recipe.nutriscore}
                </span>
              )}
              {recipe.calories && (
                <span className="text-xs text-gray-400 font-medium">{recipe.calories} kcal</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.tags.map((tag, i) => (
                <span
                  key={tag}
                  className="bg-[#005b52]/10 text-[#005b52] border border-[#005b52]/20 text-xs font-medium px-2.5 py-1 rounded-full animate-pop-in"
                  style={{ "--delay": `${i * 40}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm font-semibold mb-2 text-gray-800">Ingredients</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.ingredients.map((ing, i) => (
                <span
                  key={ing}
                  className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full animate-pop-in"
                  style={{ "--delay": `${100 + i * 30}ms` }}
                >
                  {ing}
                </span>
              ))}
            </div>

            {recipe.steps && recipe.steps.length > 0 && (
              <>
                <p className="text-sm font-semibold mb-2 text-gray-800">Etapes</p>
                <div className="space-y-2 mb-4">
                  {recipe.steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 animate-pop-in"
                      style={{ "--delay": `${200 + i * 50}ms` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#005b52] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <img src={recipe.image} alt={recipe.name} className="w-full h-36 object-cover rounded-xl animate-img-reveal" />
          </div>
        </div>
      )}
    </>
  );
}
