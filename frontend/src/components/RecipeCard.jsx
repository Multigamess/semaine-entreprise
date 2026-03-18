import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDumbbell } from "@fortawesome/free-solid-svg-icons";

export default function RecipeCard({ recipe }) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
      {/* Background image */}
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Tags top */}
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
      </div>
    </div>
  );
}
