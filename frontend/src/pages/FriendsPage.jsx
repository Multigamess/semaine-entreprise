import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../components/PostCard";
import WeeklyRecipes from "../components/WeeklyRecipes";
import { samplePosts, weeklyRecipes, creatorRecipes, friendsCooked } from "../data/sampleData";

export default function FriendsPage({ hasPosted, userPost, dbPosts = [], onPostClick }) {
  const recipesMap = Object.fromEntries(
    [...weeklyRecipes, ...creatorRecipes].map((r) => [r.id, r])
  );

  // Use DB posts if available, otherwise fallback to sample data
  const feedPosts = dbPosts.length > 0 ? dbPosts : samplePosts;

  const otherCount = friendsCooked.length - 1;
  const motivationText = `${friendsCooked[0]} et ${otherCount} ami${otherCount > 1 ? "s" : ""} ont deja cuisine cette semaine`;

  return (
    <div>
      <div className="stagger-item" style={{ "--stagger": "50ms" }}>
        <WeeklyRecipes recipes={weeklyRecipes} />
      </div>

      {/* Motivation banner */}
      <div
        className="mx-5 mt-3 mb-1 px-4 py-2.5 rounded-2xl bg-[#005b52]/8 border border-[#005b52]/20 stagger-item"
        style={{ "--stagger": "150ms" }}
      >
        <p className="text-xs font-medium text-center text-[#005b52]">
          🍳 {motivationText}
        </p>
      </div>

      {/* User's weekly realization */}
      {hasPosted && userPost ? (
        <>
          <div className="px-5 pt-4 pb-1 stagger-item flex items-center gap-2" style={{ "--stagger": "200ms" }}>
            <div className="w-1 h-3.5 rounded-full bg-[#005b52]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Ta realisation
            </p>
          </div>
          <PostCard
            post={userPost}
            recipe={recipesMap[userPost.recipeId]}
            style={{ "--stagger": "250ms" }}
          />
        </>
      ) : (
        <div className="mx-5 mt-4 mb-2 stagger-item" style={{ "--stagger": "200ms" }}>
          <button
            onClick={onPostClick}
            className="w-full py-5 rounded-[2rem] border-2 border-dashed flex flex-col items-center gap-2 tap-scale border-[#005b52]/40 bg-[#005b52]/5 hover:border-[#005b52]/60 hover:bg-[#005b52]/10"
            style={{ transition: "border-color 0.3s ease, background-color 0.3s ease" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#005b52] flex items-center justify-center animate-gentle-pulse">
              <FontAwesomeIcon icon={faCamera} className="text-white text-lg" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Poste ta realisation !</p>
            <p className="text-xs text-gray-400">Prends en photo ton plat pour voir tes amis</p>
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="mx-5 mt-3 border-t border-gray-100" />

      {/* Friends posts */}
      <div className="px-5 pt-4 pb-1 stagger-item flex items-center gap-2" style={{ "--stagger": "300ms" }}>
        <div className="w-1 h-4 rounded-full bg-[#005b52]" />
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Tes amis
        </p>
      </div>
      <div>
        {feedPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            recipe={recipesMap[post.recipeId]}
            blurred={!hasPosted}
            style={{ "--stagger": `${350 + i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
