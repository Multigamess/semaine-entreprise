import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUtensils,
  faXmark,
  faClock,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { creators, creatorFeedPosts, creatorRecipes } from "../data/sampleData";

const TYPE_LABELS = { chef: "Chef", influenceur: "Influenceur", restaurateur: "Restaurateur" };

const COOKING_REACTIONS = [
  { emoji: "😋", label: "Miam" },
  { emoji: "🔥", label: "Chaud" },
  { emoji: "👨‍🍳", label: "Chef" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "💪", label: "Proteine" },
];

function CreatorPostReactions({ likes }) {
  const [selected, setSelected] = useState(null);
  const [bouncing, setBouncing] = useState(null);
  const [counts] = useState(() =>
    COOKING_REACTIONS.map(() => Math.floor(likes / COOKING_REACTIONS.length) + Math.floor(Math.random() * 5))
  );

  function handleTap(i) {
    const wasActive = selected === i;
    setSelected(wasActive ? null : i);
    if (!wasActive) {
      setBouncing(i);
      setTimeout(() => setBouncing(null), 500);
    }
  }

  return (
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
                ? "bg-[#005b52]/10 border border-[#005b52]/30"
                : "bg-gray-50 border border-transparent"
            }`}
            style={{ transition: "background-color 0.25s ease, border-color 0.25s ease" }}
          >
            <span className={`text-sm ${bouncing === i ? "animate-emoji-bounce" : ""}`}>{r.emoji}</span>
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
  );
}

export default function CreatorsPage({ onSelectCreator }) {
  const creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c]));
  const recipesMap = Object.fromEntries(creatorRecipes.map((r) => [r.id, r]));
  const [showRecipe, setShowRecipe] = useState(null);

  const activeRecipe = showRecipe ? recipesMap[showRecipe] : null;

  return (
    <div>
      <div>
        {creatorFeedPosts.map((post, postIndex) => {
          const creator = creatorsMap[post.creatorId];
          if (!creator) return null;
          const recipe = post.recipeId ? recipesMap[post.recipeId] : null;

          return (
            <article
              key={post.id}
              className="px-5 py-4 stagger-item"
              style={{ "--stagger": `${postIndex * 120}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => onSelectCreator(creator.id)} className="flex items-center gap-3 flex-1 text-left tap-scale">
                  <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#005b52]/15" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-800">{creator.name}</p>
                      {creator.verified && <FontAwesomeIcon icon={faCheckCircle} className="text-[#005b52] text-[10px]" />}
                    </div>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: creator.theme.secondary,
                        color: creator.theme.primary,
                      }}
                    >
                      {TYPE_LABELS[creator.type]}
                    </span>
                  </div>
                </button>
                {recipe && (
                  <button
                    onClick={() => setShowRecipe(post.recipeId)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tap-scale text-[#005b52] border border-[#005b52]/30 hover:bg-[#005b52]/10"
                  >
                    <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
                    Recette
                  </button>
                )}
              </div>

              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50">
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="mt-3">
                <CreatorPostReactions likes={post.likes} />
              </div>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">{post.caption}</p>
            </article>
          );
        })}
      </div>

      {/* Recipe overlay */}
      {activeRecipe && (
        <div className="fixed inset-0 z-[100] bg-black/30 flex items-end justify-center animate-backdrop" onClick={() => setShowRecipe(null)}>
          <div className="bg-white w-full max-w-lg rounded-t-[1.5rem] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-200" />

            <button onClick={() => setShowRecipe(null)} className="absolute top-6 right-6 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center tap-scale">
              <FontAwesomeIcon icon={faXmark} className="text-sm text-gray-400" />
            </button>

            <p className="text-[11px] text-[#005b52] font-medium uppercase tracking-wider mb-1">Recette du createur</p>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{activeRecipe.name}</h3>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-xs" />{activeRecipe.time}</span>
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faDumbbell} className="text-xs" />{activeRecipe.difficulty}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeRecipe.tags.map((tag, i) => (
                <span key={tag} className="bg-[#005b52]/10 text-[#005b52] border border-[#005b52]/20 text-xs font-medium px-2.5 py-1 rounded-full animate-pop-in" style={{ "--delay": `${i * 40}ms` }}>{tag}</span>
              ))}
            </div>

            <p className="text-sm font-semibold mb-2 text-gray-800">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {activeRecipe.ingredients.map((ing, i) => (
                <span key={ing} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full animate-pop-in" style={{ "--delay": `${100 + i * 30}ms` }}>{ing}</span>
              ))}
            </div>

            <img src={activeRecipe.image} alt={activeRecipe.name} className="w-full h-36 object-cover rounded-xl mt-4 animate-img-reveal" />
          </div>
        </div>
      )}
    </div>
  );
}
