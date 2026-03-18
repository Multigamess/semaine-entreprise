import PostCard from "../components/PostCard";
import WeeklyRecipes from "../components/WeeklyRecipes";
import { samplePosts, weeklyRecipes } from "../data/sampleData";

export default function FriendsPage() {
  const recipesMap = Object.fromEntries(weeklyRecipes.map((r) => [r.id, r]));

  return (
    <div>
      {/* Weekly recipes carousel */}
      <WeeklyRecipes recipes={weeklyRecipes} />

      {/* Divider */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm font-bold text-gray-800">
          Les realisations de tes amis
        </p>
      </div>

      {/* Friends posts */}
      <div className="divide-y divide-gray-100">
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
