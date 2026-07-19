import { serverFetch } from "../core/server";

export const getAllLessons = async () => {
  return serverFetch("/api/all/public/lessons");
};

export async function getLessonById(id) {
  return serverFetch(`/api/all/public/lessons${id}`);
}

export async function getLessons({ category = "", emotionalTone = "", search = "", sort = "newest" } = {}) {
  const query = new URLSearchParams({category, emotionalTone, search, sort});
  return serverFetch(`/api/all/public/lessons?${query.toString()}`)
}


