import { useState } from "react";
import PostCard from "../components/PostCard";
import WeeklyRecipes from "../components/WeeklyRecipes";
import { samplePosts, weeklyRecipes, creatorRecipes, userWeeklyRealization } from "../data/sampleData";

export default function FriendsPage() {
  const recipesMap = Object.fromEntries(
    [...weeklyRecipes, ...creatorRecipes].map((r) => [r.id, r])
  );
  const [realExpanded, setRealExpanded] = useState(false);

  // Always use curated sample data for clean demo
  const feedPosts = samplePosts;
  const myPost = userWeeklyRealization;
  const myRecipe = recipesMap[myPost?.recipeId];

  return (
    <div>
      <div className="stagger-item" style={{ "--stagger": "50ms" }}>
        <WeeklyRecipes recipes={weeklyRecipes} />
      </div>

      {/* Ta réalisation — compact thumbnail, tap to expand */}
      {myPost && !realExpanded && (
        <div className="mx-5 mt-4 stagger-item" style={{ "--stagger": "120ms" }}>
          <button
            onClick={() => setRealExpanded(true)}
            className="w-full flex items-center gap-3 rounded-2xl overflow-hidden text-left tap-scale animate-fade-in-up"
            style={{
              "--delay": "0ms",
              backgroundColor: "var(--brand-light)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <img
              src={myPost.mainImage}
              alt=""
              className="w-14 h-14 object-cover flex-shrink-0 rounded-l-2xl"
            />
            <div className="flex-1 min-w-0 py-2.5 pr-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                Ta réalisation
              </p>
              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {myPost.caption}
              </p>
            </div>
            <span className="pr-3 text-[10px] font-medium" style={{ color: "var(--brand)" }}>
              Voir
            </span>
          </button>
        </div>
      )}

      {/* Expanded realization */}
      {myPost && realExpanded && (
        <div className="px-5 mt-4 stagger-item animate-fade-in-up" style={{ "--stagger": "120ms", "--delay": "0ms" }}>
          <PostCard
            post={myPost}
            recipe={myRecipe}
            hideRecipeButton={true}
            style={{ "--stagger": "0ms" }}
          />
          <button
            onClick={() => setRealExpanded(false)}
            className="w-full text-center py-1.5 text-[11px] font-medium tap-scale"
            style={{ color: "var(--brand)" }}
          >
            Réduire
          </button>
        </div>
      )}

      {/* Friends posts */}
      <div className="px-5 pt-5 pb-1 stagger-item flex items-center gap-2" style={{ "--stagger": "150ms" }}>
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
        <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Tes amis
        </p>
      </div>
      <div>
        {feedPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            recipe={recipesMap[post.recipeId]}
            style={{ "--stagger": `${200 + i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
