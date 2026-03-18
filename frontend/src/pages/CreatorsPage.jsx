import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCheckCircle,
  faUtensils,
  faXmark,
  faClock,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { creators, creatorFeedPosts, creatorRecipes } from "../data/sampleData";

const TYPE_LABELS = { chef: "Chef", influenceur: "Influenceur", restaurateur: "Restaurateur" };

export default function CreatorsPage({ onSelectCreator }) {
  const creatorsMap = Object.fromEntries(creators.map((c) => [c.id, c]));
  const recipesMap = Object.fromEntries(creatorRecipes.map((r) => [r.id, r]));
  const [showRecipe, setShowRecipe] = useState(null);

  const activeRecipe = showRecipe ? recipesMap[showRecipe] : null;

  return (
    <div>
      {/* Suggested creators */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-sm font-semibold text-gray-900 mb-3">Createurs a suivre</p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {creators.map((creator) => (
            <button
              key={creator.id}
              onClick={() => onSelectCreator(creator.id)}
              className="flex flex-col items-center gap-1.5 min-w-[68px]"
            >
              <div
                className="w-14 h-14 rounded-full p-[2px]"
                style={{ background: `linear-gradient(135deg, ${creator.theme.primary}, ${creator.theme.accent})` }}
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-[10px] font-medium text-gray-600 truncate w-16 text-center">
                {creator.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 border-t border-gray-100" />

      {/* Feed */}
      <div>
        {creatorFeedPosts.map((post) => {
          const creator = creatorsMap[post.creatorId];
          if (!creator) return null;
          const recipe = post.recipeId ? recipesMap[post.recipeId] : null;

          return (
            <article key={post.id} className="px-5 py-4">
              {/* Creator header */}
              <button
                onClick={() => onSelectCreator(creator.id)}
                className="flex items-center gap-3 mb-3 w-full text-left"
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900">{creator.name}</p>
                    {creator.verified && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-[10px]" />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: creator.theme.secondary, color: creator.theme.primary }}
                  >
                    {TYPE_LABELS[creator.type]}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">{post.time}</span>
              </button>

              {/* Post image */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-full px-2.5 py-1 transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-sm text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                  </span>
                </button>

                {recipe && (
                  <button
                    onClick={() => setShowRecipe(post.recipeId)}
                    className="flex items-center gap-1.5 text-blue-500 border border-blue-200 hover:bg-blue-50 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  >
                    <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
                    Recette
                  </button>
                )}
              </div>

              {/* Caption */}
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{post.caption}</p>
            </article>
          );
        })}
      </div>

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

            <p className="text-[11px] text-blue-500 font-medium uppercase tracking-wider mb-1">
              Recette du createur
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {activeRecipe.name}
            </h3>

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
                <span
                  key={tag}
                  className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {activeRecipe.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full"
                >
                  {ing}
                </span>
              ))}
            </div>

            <img
              src={activeRecipe.image}
              alt={activeRecipe.name}
              className="w-full h-36 object-cover rounded-xl mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
