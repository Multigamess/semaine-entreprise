import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faUtensils,
  faXmark,
  faClock,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";

export default function PostCard({ post, recipe }) {
  const [showSelfie, setShowSelfie] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <>
      <article className="px-5 py-4">
        {/* User header */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {post.user.name}
            </p>
            <p className="text-[11px] text-gray-400">{post.time}</p>
          </div>
        </div>

        {/* Dual camera photo */}
        <div
          className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 cursor-pointer"
          onClick={() => setShowSelfie(!showSelfie)}
        >
          <img
            src={showSelfie ? post.selfieImage : post.mainImage}
            alt="Plat"
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute top-3 left-3 w-[26%] aspect-square rounded-lg overflow-hidden border-2 border-white">
            <img
              src={showSelfie ? post.mainImage : post.selfieImage}
              alt="Selfie"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mt-3">
          {/* Reactions */}
          <div className="flex items-center gap-1.5">
            {post.reactions.map((r, i) => (
              <button
                key={i}
                className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:border-blue-200 rounded-full px-2.5 py-1 transition-colors"
              >
                <span className="text-sm">{r.emoji}</span>
                <span className="text-xs text-gray-500 font-medium">{r.count}</span>
              </button>
            ))}
            <button className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 hover:border-blue-200 flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faFaceSmile} className="text-xs text-gray-400" />
            </button>
          </div>

          {/* See recipe button */}
          {recipe && (
            <button
              onClick={() => setShowRecipe(true)}
              className="flex items-center gap-1.5 text-blue-500 border border-blue-200 hover:bg-blue-50 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
              Recette
            </button>
          )}
        </div>

        {/* Caption */}
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {post.caption}
        </p>
      </article>

      {/* Recipe overlay */}
      {showRecipe && recipe && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 flex items-end justify-center"
          onClick={() => setShowRecipe(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-[1.5rem] p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

            {/* Close button */}
            <button
              onClick={() => setShowRecipe(false)}
              className="absolute top-6 right-6 w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-sm" />
            </button>

            {/* Recipe content */}
            <p className="text-[11px] text-blue-500 font-medium uppercase tracking-wider mb-1">
              Recette
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {recipe.name}
            </h3>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-gray-300 text-xs" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faDumbbell} className="text-gray-300 text-xs" />
                {recipe.difficulty}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Ingredients */}
            <p className="text-sm font-semibold text-gray-900 mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full"
                >
                  {ing}
                </span>
              ))}
            </div>

            {/* Recipe image */}
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-36 object-cover rounded-xl mt-4"
            />
          </div>
        </div>
      )}
    </>
  );
}
