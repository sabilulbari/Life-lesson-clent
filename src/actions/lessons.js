"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const EXPRESS_API = process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:5000";

// Helper to retrieve the active user session and headers
async function getAuthHeaders() {
  const nextHeaders = await headers();
  const session = await auth.api.getSession({
    headers: nextHeaders,
  });

  if (!session || !session.user) {
    return {};
  }

  const user = session.user;
  return {
    "x-user-id": user.id,
    "x-user-email": user.email || "",
    "x-user-role": user.role || "user",
    "x-user-plan": user.plan || "free",
    "x-user-name": user.name || "",
    "x-user-photo": user.image || "",
  };
}

// 3. Get top contributors of the week
export async function getTopContributors() {
  try {
    const res = await fetch(`${EXPRESS_API}/api/lessons/top-contributors`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch top contributors");
    return await res.json();
  } catch (error) {
    console.error("Error in getTopContributors:", error);
    return [];
  }
}

// 4. Get most saved lessons
export async function getMostSavedLessons() {
  try {
    const res = await fetch(`${EXPRESS_API}/api/lessons/most-saved`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch most saved lessons");
    return await res.json();
  } catch (error) {
    console.error("Error in getMostSavedLessons:", error);
    return [];
  }
}

// 6. Get My Favorites (favorited by authenticated user)
export async function getMyFavorites() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return [];

    const res = await fetch(`${EXPRESS_API}/api/lessons/my-favorites`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch my favorites");
    return await res.json();
  } catch (error) {
    console.error("Error in getMyFavorites:", error);
    return [];
  }
}

// 7. Get lessons by a specific author
export async function getAuthorLessons(authorId) {
  try {
    const res = await fetch(`${EXPRESS_API}/api/lessons/author/${authorId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch author lessons");
    return await res.json();
  } catch (error) {
    console.error("Error in getAuthorLessons:", error);
    return [];
  }
}

// 8. Get admin lessons
export async function getAdminLessons({ category = "", visibility = "", isReviewed = "" } = {}) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return [];

    const query = new URLSearchParams({ category, visibility, isReviewed });
    const res = await fetch(`${EXPRESS_API}/api/lessons/admin-all?${query.toString()}`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch admin lessons");
    return await res.json();
  } catch (error) {
    console.error("Error in getAdminLessons:", error);
    return [];
  }
}

// 9. Get single lesson details
export async function getLessonById(id) {
  try {
    const res = await fetch(`${EXPRESS_API}/api/all/public/lessons/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error in getLessonById:", error);
    return null;
  }
}


// 12. Delete a lesson


// 14. Favorite toggle

// COMMENTS SERVER ACTIONS

// 2. Add comment


// REPORTS SERVER ACTIONS

// 1. Report a lesson



