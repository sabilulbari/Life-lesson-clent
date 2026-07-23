"use server"
import { headers } from "next/headers";
import auth from "../auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return res.json();
};


export const serverMutatoion = async (path, data, method = "POST") => {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders["x-user-id"]) return { error: "Unauthorized" };

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || "Failed to create lesson" };
    return { success: true, lesson: result };
  } catch (error) {
    console.error("Error in createLesson:", error);
    return { error: error.message };
  }
};
