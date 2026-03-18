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
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">
              {post.user.name}
            </p>
            <p className="text-xs text-gray-400">{post.time}</p>
          </div>
        </div>

        {/* Dual camera photo */}
        <div
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => setShowSelfie(!showSelfie)}
        >
          <img
            src={showSelfie ? post.selfieImage : post.mainImage}
            alt="Plat"
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute top-3 left-3 w-[28%] aspect-square rounded-xl overflow-hidden border-[3px] border-black/80">
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
                className="flex items-center gap-1 bg-gray-100 hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors"
              >
                <span className="text-sm">{r.emoji}</span>
                <span className="text-xs text-gray-500 font-medium">{r.count}</span>
              </button>
            ))}
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faFaceSmile} className="text-sm text-gray-400" />
            </button>
          </div>

          {/* See recipe button */}
          {recipe && (
            <button
              onClick={() => setShowRecipe(true)}
              className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
              Recette
            </button>
          )}
        </div>

        {/* Caption */}
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          {post.caption}
        </p>
      </article>

      {/* Recipe overlay */}
      {showRecipe && recipe && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowRecipe(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-[2rem] p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Close button */}
            <button
              onClick={() => setShowRecipe(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
            </button>

            {/* Recipe content */}
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
              Recette de la semaine
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {recipe.name}
            </h3>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-blue-500 text-xs" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faDumbbell} className="text-blue-500 text-xs" />
                {recipe.difficulty}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Ingredients */}
            <p className="text-sm font-semibold text-gray-800 mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full"
                >
                  {ing}
                </span>
              ))}
            </div>

            {/* Recipe image */}
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-40 object-cover rounded-2xl mt-4"
            />
          </div>
        </div>
      )}
    </>
  );
}
