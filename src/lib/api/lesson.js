import { authorizeServerFetch, serverFetch } from "../core/server";

export const getAllLessons = async () => {
  return serverFetch("/api/all/public/lessons");
};

export async function getLessonById(id) {
  return serverFetch(`/api/all/public/lessons/${id}`);
}

export const getUserStats = async () => {
  return authorizeServerFetch(`/api/users/stats`, "user");
};


export async function getLessons({ category = "", emotionalTone = "", search = "", sort = "newest" } = {}) {
  const query = new URLSearchParams({category, emotionalTone, search, sort});
  return serverFetch(`/api/all/public/lessons?${query.toString()}`)
}

export const getUserLesson = async(id)=>{
  return serverFetch(`/api/lessons/my-lessons/${id}`);
}

export const getMyFavoritesLesson = async(userId)=>{
  return serverFetch(`/api/lesson/my-favorites/${userId}`);
}



