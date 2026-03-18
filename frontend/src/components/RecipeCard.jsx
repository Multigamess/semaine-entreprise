import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDumbbell } from "@fortawesome/free-solid-svg-icons";

export default function RecipeCard({ recipe }) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-md flex-shrink-0">
      {/* Background image */}
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Tags top */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white text-lg font-bold leading-tight mb-2">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            {recipe.time}
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faDumbbell} className="text-xs" />
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
