import { supabase } from "./supabase";
import { profileUser } from "../data/sampleData";

const BUCKET = "post-images";

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

  const blob = base64ToBlob(base64DataUrl);
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, blob, { contentType: blob.type, upsert: false });

  if (error) {
    console.error("Image upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Create a post in Supabase
 * Uploads both images then inserts a row in the posts table
 * Returns the created post in frontend format, or null on failure
 */
export async function createPost({ mainImage, selfieImage, caption, recipeId }) {
  if (!supabase) return null;

  try {
    // Upload both images in parallel
    const [mainUrl, selfieUrl] = await Promise.all([
      uploadImage(mainImage),
      uploadImage(selfieImage),
    ]);

    if (!mainUrl || !selfieUrl) {
      console.error("Failed to upload one or both images");
      return null;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_name: "Toi",
        user_avatar: profileUser.avatar,
        recipe_id: recipeId || null,
        main_image_url: mainUrl,
        selfie_image_url: selfieUrl,
        caption: caption || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Post insert failed:", error.message);
      return null;
    }

    return rowToPost(data);
  } catch (err) {
    console.error("createPost error:", err);
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
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Fetch posts failed:", error.message);
      return [];
    }

    return (data || []).map(rowToPost);
  } catch (err) {
    console.error("fetchPosts error:", err);
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
