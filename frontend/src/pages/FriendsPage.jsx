import PostCard from "../components/PostCard";
import { samplePosts } from "../data/sampleData";

export default function FriendsPage() {
  return (
    <div className="flex flex-col gap-2 bg-gray-50">
      {samplePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
