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

          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/80 backdrop-blur-sm text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
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
            </div>
            {/* Hint */}
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
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {recipe.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#005b52]/10 text-[#005b52]">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-800">Ingredients</p>
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005b52] flex-shrink-0" />
                  {ing}
                </div>
              ))}
            </div>

            <p className="text-[10px] mt-5 text-center flex items-center justify-center gap-1 text-gray-400">
              <FontAwesomeIcon icon={faRotate} className="text-[8px]" />
              Appuie pour retourner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
