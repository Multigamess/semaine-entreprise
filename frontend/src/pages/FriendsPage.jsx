import PostCard from "../components/PostCard";
import WeeklyRecipes from "../components/WeeklyRecipes";
import { samplePosts, weeklyRecipes, userWeeklyRealization } from "../data/sampleData";

export default function FriendsPage() {
  const recipesMap = Object.fromEntries(weeklyRecipes.map((r) => [r.id, r]));

  return (
    <div>
      {/* Weekly recipes carousel */}
      <WeeklyRecipes recipes={weeklyRecipes} />

      {/* User's weekly realization */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">
          Ta realisation
        </p>
      </div>
      <PostCard
        post={userWeeklyRealization}
        recipe={recipesMap[userWeeklyRealization.recipeId]}
      />

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100" />

      {/* Friends posts */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">
          Tes amis
        </p>
      </div>
      <div>
        {samplePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            recipe={recipesMap[post.recipeId]}
          />
        ))}
      </div>
    </div>
  );
}
