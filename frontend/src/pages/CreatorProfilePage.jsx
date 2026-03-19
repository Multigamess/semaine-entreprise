import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faHeart,
  faClock,
  faChevronLeft,
  faChevronRight,
  faUtensils,
  faXmark,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { creatorRecipes } from "../data/sampleData";

const TYPE_LABELS = { chef: "Chef", influenceur: "Influenceur", restaurateur: "Restaurateur" };

export default function CreatorProfilePage({ creator, onBack }) {
  const { theme } = creator;
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [showRecipe, setShowRecipe] = useState(null);

  const recipesMap = Object.fromEntries(creatorRecipes.map((r) => [r.id, r]));
  const activeRecipe = showRecipe ? recipesMap[showRecipe] : null;

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }
  function handleTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentRecipe < creator.featuredRecipes.length - 1) setCurrentRecipe(currentRecipe + 1);
      else if (diff < 0 && currentRecipe > 0) setCurrentRecipe(currentRecipe - 1);
    }
    setTouchStart(null);
  }

  return (
    <div style={{ backgroundColor: theme.bg }} className="min-h-screen">
      {/* Themed header banner */}
      <div
        className="relative px-5 pt-3 pb-6"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
      >
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-white text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-18 h-18 rounded-full object-cover border-2 border-white/30"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{creator.name}</h2>
              {creator.verified && (
                <FontAwesomeIcon icon={faCheckCircle} className="text-white/80 text-xs" />
              )}
            </div>
            <span
              className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
            >
              {TYPE_LABELS[creator.type]}
            </span>
            <div className="flex gap-5 mt-2">
              <div>
                <p className="text-sm font-bold text-white">
                  {creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers}
                </p>
                <p className="text-[10px] text-white/60">Abonnes</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{creator.recipes}</p>
                <p className="text-[10px] text-white/60">Recettes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio + Follow */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-500 leading-relaxed mb-3">{creator.bio}</p>
        <button
          className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: theme.primary }}
        >
          Suivre
        </button>
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* Featured recipes carousel */}
      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Recettes en vedette</p>
        <div
          className="overflow-hidden rounded-xl relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentRecipe * 100}%)` }}
          >
            {creator.featuredRecipes.map((recipe, i) => (
              <div key={i} className="w-full flex-shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden">
                <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-base font-bold">{recipe.name}</h3>
                  <span className="flex items-center gap-1 text-white/70 text-xs mt-1">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                    {recipe.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {currentRecipe > 0 && (
            <button
              onClick={() => setCurrentRecipe(currentRecipe - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 border border-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs text-gray-600" />
            </button>
          )}
          {currentRecipe < creator.featuredRecipes.length - 1 && (
            <button
              onClick={() => setCurrentRecipe(currentRecipe + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 border border-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-600" />
            </button>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {creator.featuredRecipes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentRecipe(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === currentRecipe ? "1.25rem" : "0.375rem",
                backgroundColor: i === currentRecipe ? theme.primary : "#E2E8F0",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* Creator posts */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">Publications</p>
      </div>
      <div>
        {creator.posts.map((post) => {
          const recipe = post.recipeId ? recipesMap[post.recipeId] : null;
          return (
            <article key={post.id} className="px-5 py-4">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-full px-2.5 py-1 transition-colors">
                    <FontAwesomeIcon icon={faHeart} className="text-sm text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">
                      {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                    </span>
                  </button>
                  <span className="text-[11px] text-gray-400">{post.time}</span>
                </div>
                {recipe && (
                  <button
                    onClick={() => setShowRecipe(post.recipeId)}
                    className="flex items-center gap-1.5 text-[#005b52] border border-[#005b52]/30 hover:bg-[#005b52]/10 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  >
                    <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
                    Recette
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{post.caption}</p>
            </article>
          );
        })}
      </div>

      <div className="h-20" />

      {/* Recipe overlay */}
      {activeRecipe && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 flex items-end justify-center"
          onClick={() => setShowRecipe(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-[1.5rem] p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <button
              onClick={() => setShowRecipe(null)}
              className="absolute top-6 right-6 w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-sm" />
            </button>

            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: theme.primary }}>
              Recette de {creator.name}
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{activeRecipe.name}</h3>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-gray-300 text-xs" />
                {activeRecipe.time}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faDumbbell} className="text-gray-300 text-xs" />
                {activeRecipe.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeRecipe.tags.map((tag) => (
                <span key={tag} className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {activeRecipe.ingredients.map((ing) => (
                <span key={ing} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                  {ing}
                </span>
              ))}
            </div>

            <img src={activeRecipe.image} alt={activeRecipe.name} className="w-full h-36 object-cover rounded-xl mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}
