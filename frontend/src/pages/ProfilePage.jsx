import PostCard from "../components/PostCard";
import { profileUser, profilePosts, weeklyRecipes } from "../data/sampleData";

export default function ProfilePage() {
  const recipesMap = Object.fromEntries(weeklyRecipes.map((r) => [r.id, r]));

  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-col items-center pt-4 pb-6 px-5">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <h2 className="mt-3 text-lg font-bold text-slate-800">
          {profileUser.name}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">{profileUser.bio}</p>

        {/* Stats */}
        <div className="flex gap-8 mt-4">
          {[
            { value: profileUser.stats.plats, label: "Plats" },
            { value: profileUser.stats.amis, label: "Amis" },
            { value: profileUser.stats.semaines, label: "Semaines" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-lg font-bold text-slate-800">
                {stat.value}
              </span>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-gray-100">
        {profilePosts.map((post) => (
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
