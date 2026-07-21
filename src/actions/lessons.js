"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const EXPRESS_API = process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:5000";

// Helper to retrieve the active user session and headers
async function getAuthHeaders() {
  const nextHeaders = await headers();
  const session = await auth.api.getSession({
    headers: nextHeaders
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
    "x-user-photo": user.image || ""
  };
}


// 3. Get top contributors of the week
export async function getTopContributors() {
  try {
    const res = await fetch(`${EXPRESS_API}/api/lessons/top-contributors`, {
      cache: "no-store"
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
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch most saved lessons");
    return await res.json();
  } catch (error) {
    console.error("Error in getMostSavedLessons:", error);
    return [];
  }
}

// 5. Get My Lessons (owned by authenticated user)
export async function getMyLessons() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return [];

    const res = await fetch(`${EXPRESS_API}/api/lessons/my-lessons`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch my lessons");
    return await res.json();
  } catch (error) {
    console.error("Error in getMyLessons:", error);
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
      cache: "no-store"
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
      cache: "no-store"
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
      cache: "no-store"
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

// 10. Create a lesson
export async function createLesson(data) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to create lesson" };
    return { success: true, lesson: result };
  } catch (error) {
    console.error("Error in createLesson:", error);
    return { error: error.message };
  }
}

// 11. Update a lesson
export async function updateLesson(id, data) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to update lesson" };
    return { success: true, lesson: result };
  } catch (error) {
    console.error("Error in updateLesson:", error);
    return { error: error.message };
  }
}

// 12. Delete a lesson
export async function deleteLesson(id) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}`, {
      method: "DELETE",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to delete lesson" };
    return { success: true };
  } catch (error) {
    console.error("Error in deleteLesson:", error);
    return { error: error.message };
  }
}

// 13. Like toggle
export async function likeLesson(id) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}/like`, {
      method: "PATCH",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to like lesson" };
    return { success: true, ...result };
  } catch (error) {
    console.error("Error in likeLesson:", error);
    return { error: error.message };
  }
}

// 14. Favorite toggle
export async function favoriteLesson(id) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}/favorite`, {
      method: "PATCH",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to favorite lesson" };
    return { success: true, ...result };
  } catch (error) {
    console.error("Error in favoriteLesson:", error);
    return { error: error.message };
  }
}

// 15. Toggle feature (Admin)
export async function toggleFeatureLesson(id) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}/feature`, {
      method: "PATCH",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to toggle featured status" };
    return { success: true, featured: result.featured };
  } catch (error) {
    console.error("Error in toggleFeatureLesson:", error);
    return { error: error.message };
  }
}

// 16. Mark as reviewed (Admin)
export async function reviewLesson(id) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/lessons/${id}/review`, {
      method: "PATCH",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to mark reviewed" };
    return { success: true, isReviewed: result.isReviewed };
  } catch (error) {
    console.error("Error in reviewLesson:", error);
    return { error: error.message };
  }
}

// COMMENTS SERVER ACTIONS

// 1. Get comments for a lesson
export async function getComments(lessonId) {
  try {
    const res = await fetch(`${EXPRESS_API}/api/comments/${lessonId}`, {
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (error) {
    console.error("Error in getComments:", error);
    return [];
  }
}

// 2. Add comment
export async function addComment(lessonId, content) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify({ lessonId, content })
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to post comment" };
    return { success: true, comment: result };
  } catch (error) {
    console.error("Error in addComment:", error);
    return { error: error.message };
  }
}

// REPORTS SERVER ACTIONS

// 1. Report a lesson

export async function reportLesson1(lessonId, lessonTitle, reason){
  const res = await fetch(`${EXPRESS_API}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessonId, lessonTitle, reason }),
  });

  const result = await res.json()
  return result;
}
export async function reportLesson(lessonId, lessonTitle, reason) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify({ lessonId, lessonTitle, reason })
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to file report" };
    return { success: true, report: result };
  } catch (error) {
    console.error("Error in reportLesson:", error);
    return { error: error.message };
  }
}

// 2. Get reported lessons list (Admin)
export async function getReports() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return [];

    const res = await fetch(`${EXPRESS_API}/api/reports`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch reports");
    return await res.json();
  } catch (error) {
    console.error("Error in getReports:", error);
    return [];
  }
}

// 3. Get detailed reports for a lesson (Admin)
export async function getReportDetails(lessonId) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return [];

    const res = await fetch(`${EXPRESS_API}/api/reports/${lessonId}/details`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch report details");
    return await res.json();
  } catch (error) {
    console.error("Error in getReportDetails:", error);
    return [];
  }
}

// 4. Ignore reports for a lesson (Admin)
export async function ignoreReports(lessonId) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/reports/${lessonId}/ignore`, {
      method: "DELETE",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to clear reports" };
    return { success: true };
  } catch (error) {
    console.error("Error in ignoreReports:", error);
    return { error: error.message };
  }
}
