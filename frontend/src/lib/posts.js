import { supabase } from "./supabase";
import { profileUser } from "../data/sampleData";

const BUCKET = "post-images";

// Log connection status on load
if (supabase) {
  console.log("[bonapp] Supabase connected:", supabase.supabaseUrl);
} else {
  console.warn("[bonapp] Supabase not configured — using sample data");
}

/**
 * Convert a base64 data URL to a Blob
 */
function base64ToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)[1];
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/**
 * Convert ISO timestamp to French relative time string
 */
function timeAgo(dateString) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "A l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)}j`;
  return `Il y a ${Math.floor(diff / 604800)} sem`;
}

/**
 * Upload a base64 image to Supabase Storage
 * Returns the public URL or null on failure
 */
async function uploadImage(base64DataUrl) {
  if (!supabase) return null;

  try {
    const blob = base64ToBlob(base64DataUrl);
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `posts/${fileName}`;

    console.log(`[bonapp] Uploading image to ${BUCKET}/${filePath} (${(blob.size / 1024).toFixed(0)}KB)`);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, blob, { contentType: blob.type, upsert: false });

    if (error) {
      console.error("[bonapp] Image upload failed:", error.message, error);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    console.log("[bonapp] Image uploaded:", data.publicUrl);
    return data.publicUrl;
  } catch (err) {
    console.error("[bonapp] Upload exception:", err);
    return null;
  }
}

/**
 * Create a post in Supabase
 * Uploads both images then inserts a row in the posts table
 * Falls back to base64 storage if image upload fails
 * Returns the created post in frontend format, or null on failure
 */
export async function createPost({ mainImage, selfieImage, caption, recipeId }) {
  if (!supabase) {
    console.warn("[bonapp] Cannot create post — Supabase not configured");
    return null;
  }

  try {
    console.log("[bonapp] Creating post...");

    // Try to upload both images in parallel
    const [mainUrl, selfieUrl] = await Promise.all([
      uploadImage(mainImage),
      uploadImage(selfieImage),
    ]);

    // Use uploaded URLs, or fall back to base64 data URLs for MVP
    const finalMainUrl = mainUrl || mainImage;
    const finalSelfieUrl = selfieUrl || selfieImage;

    if (!mainUrl || !selfieUrl) {
      console.warn("[bonapp] Storage upload failed — falling back to base64 in DB");
      console.warn("[bonapp] Check: 1) Bucket 'post-images' exists  2) Bucket is public  3) Storage policies allow insert");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_name: "Toi",
        user_avatar: profileUser.avatar,
        recipe_id: recipeId || null,
        main_image_url: finalMainUrl,
        selfie_image_url: finalSelfieUrl,
        caption: caption || "",
      })
      .select()
      .single();

    if (error) {
      console.error("[bonapp] Post insert failed:", error.message, error);
      console.error("[bonapp] Check: 1) Table 'posts' exists  2) RLS policies allow insert  3) Column names match");
      return null;
    }

    console.log("[bonapp] Post saved! ID:", data.id);
    return rowToPost(data);
  } catch (err) {
    console.error("[bonapp] createPost error:", err);
    return null;
  }
}

/**
 * Fetch all posts from Supabase, newest first
 * Returns array of posts in frontend format, or empty array on failure
 */
export async function fetchPosts() {
  if (!supabase) return [];

  try {
    console.log("[bonapp] Fetching posts...");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[bonapp] Fetch posts failed:", error.message, error);
      return [];
    }

    console.log(`[bonapp] Loaded ${(data || []).length} posts from DB`);
    return (data || []).map(rowToPost);
  } catch (err) {
    console.error("[bonapp] fetchPosts error:", err);
    return [];
  }
}

/**
 * Transform a Supabase row into the frontend post shape
 */
function rowToPost(row) {
  return {
    id: row.id,
    user: {
      name: row.user_name,
      avatar: row.user_avatar || profileUser.avatar,
    },
    recipeId: row.recipe_id,
    mainImage: row.main_image_url,
    selfieImage: row.selfie_image_url,
    caption: row.caption,
    reactions: row.reactions || [],
    time: timeAgo(row.created_at),
  };
}
