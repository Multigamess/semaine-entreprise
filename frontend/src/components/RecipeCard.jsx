import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDumbbell, faRotate } from "@fortawesome/free-solid-svg-icons";

export default function RecipeCard({ recipe, flipped, onFlip }) {
  return (
    <div className="perspective-1000 w-full aspect-[3/4]" onClick={onFlip}>
      <div
        className={`relative w-full h-full preserve-3d flip-transition ${
          flipped ? "flipped" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Tags + Nutriscore */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/80 backdrop-blur-sm text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            {recipe.nutriscore && (
              <span className={`nutriscore-${recipe.nutriscore} text-[10px] font-bold w-7 h-7 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 ml-2`}>
                {recipe.nutriscore}
              </span>
            )}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-base font-bold leading-tight mb-1.5">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faDumbbell} className="text-[10px]" />
                {recipe.difficulty}
              </span>
              {recipe.calories && (
                <span className="text-white/50">{recipe.calories} kcal</span>
              )}
            </div>
            <p className="text-white/40 text-[10px] mt-2 flex items-center gap-1">
              <FontAwesomeIcon icon={faRotate} className="text-[8px]" />
              Appuie pour voir la recette
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex flex-col bg-white border border-gray-100">
          <div className="flex-1 px-5 pt-6 overflow-y-auto pb-4">
            <h3 className="text-lg font-bold mb-1 text-gray-800">{recipe.name}</h3>

            <div className="flex items-center gap-3 text-xs mb-4 text-gray-400">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faDumbbell} className="text-[10px]" />
                {recipe.difficulty}
              </span>
              {recipe.nutriscore && (
                <span className={`nutriscore-${recipe.nutriscore} text-[9px] font-bold w-5 h-5 rounded flex items-center justify-center`}>
                  {recipe.nutriscore}
                </span>
              )}
              {recipe.calories && (
                <span className="text-gray-300">{recipe.calories} kcal</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#005b52]/10 text-[#005b52]">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-800">Ingredients</p>
            <div className="space-y-1.5 mb-4">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005b52] flex-shrink-0" />
                  {ing}
                </div>
              ))}
            </div>

            {recipe.steps && recipe.steps.length > 0 && (
              <>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-800">Etapes</p>
                <div className="space-y-2 mb-3">
                  {recipe.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#005b52] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-gray-500 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="text-[10px] mt-2 text-center flex items-center justify-center gap-1 text-gray-400">
              <FontAwesomeIcon icon={faRotate} className="text-[8px]" />
              Appuie pour retourner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
