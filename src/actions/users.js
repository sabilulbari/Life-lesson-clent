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

// 1. Get user statistics (Dashboard Home)
export async function getUserStats() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return null;

    const res = await fetch(`${EXPRESS_API}/api/users/stats`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch user stats");
    return await res.json();
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return null;
  }
}

// 2. Get admin dashboard statistics (Admin Home)
export async function getAdminStats() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"] || authHeaders["x-user-role"] !== "admin") return null;

    const res = await fetch(`${EXPRESS_API}/api/users/admin/stats`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return await res.json();
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    return null;
  }
}

// 3. Get all users (Admin panel)
export async function getAdminUsersList() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"] || authHeaders["x-user-role"] !== "admin") return [];

    const res = await fetch(`${EXPRESS_API}/api/users/admin/list`, {
      headers: authHeaders,
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch users list");
    return await res.json();
  } catch (error) {
    console.error("Error in getAdminUsersList:", error);
    return [];
  }
}

// 4. Update user role (Admin panel)
export async function updateUserRole(targetUserId, newRole) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"] || authHeaders["x-user-role"] !== "admin") return { error: "Forbidden" };

    const res = await fetch(`${EXPRESS_API}/api/users/admin/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify({ targetUserId, newRole })
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to update role" };
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return { error: error.message };
  }
}

// 5. Delete a user account (Admin panel)
export async function deleteUserAccount(targetUserId) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"] || authHeaders["x-user-role"] !== "admin") return { error: "Forbidden" };

    const res = await fetch(`${EXPRESS_API}/api/users/admin/${targetUserId}`, {
      method: "DELETE",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to delete user" };
    return { success: true };
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    return { error: error.message };
  }
}

// 6. Update user's own profile (Name, Photo URL)
export async function updateProfile(data) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to update profile" };
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { error: error.message };
  }
}

// 7. Get Stripe Checkout Session Url
export async function getStripeSession() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok || !result.url) return { error: result.error || "Failed to initiate Stripe session" };
    return { success: true, url: result.url };
  } catch (error) {
    console.error("Error in getStripeSession:", error);
    return { error: error.message };
  }
}

// 8. Mock Upgrade to Premium (Immediate upgrade shortcut for testing)
export async function mockUpgradePremium() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${EXPRESS_API}/api/stripe/mock-upgrade`, {
      method: "POST",
      headers: authHeaders
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to upgrade" };
    return { success: true, plan: "premium" };
  } catch (error) {
    console.error("Error in mockUpgradePremium:", error);
    return { error: error.message };
  }
}
