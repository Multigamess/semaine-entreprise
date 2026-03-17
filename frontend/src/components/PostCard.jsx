import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faComment,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function PostCard({ post }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const hasMultipleImages = post.images.length > 1;

  function prevImage() {
    setCurrentImage((i) => (i === 0 ? post.images.length - 1 : i - 1));
  }

  function nextImage() {
    setCurrentImage((i) => (i === post.images.length - 1 ? 0 : i + 1));
  }

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(null);

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStart(null);
  }

  return (
    <article className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-400"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {post.user.name}
          </p>
          <p className="text-[11px] text-gray-400">{post.time}</p>
        </div>
      </div>

      {/* Image carousel */}
      <div
        className="relative aspect-square bg-gray-100 overflow-hidden"
        onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
        onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
      >
        <img
          src={post.images[currentImage]}
          alt="Post"
          className="w-full h-full object-cover"
        />

        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImage
                      ? "bg-white w-3"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-4">
        <button
          onClick={() => setLiked(!liked)}
          className="transition-transform active:scale-125"
        >
          <FontAwesomeIcon
            icon={liked ? faHeartSolid : faHeartRegular}
            className={`text-xl ${liked ? "text-red-500" : "text-gray-700"}`}
          />
        </button>
        <button>
          <FontAwesomeIcon
            icon={faComment}
            className="text-xl text-gray-700"
          />
        </button>
      </div>

      {/* Likes */}
      <p className="px-4 text-sm font-semibold text-gray-900">
        {liked ? post.likes + 1 : post.likes} j&apos;aime
      </p>

      {/* Caption */}
      <p className="px-4 pb-3 pt-1 text-sm text-gray-700">
        <span className="font-semibold">{post.user.name}</span>{" "}
        {post.caption}
      </p>
    </article>
  );
}
