import { authorizeServerFetch, serverFetch } from "../core/server";

export const getAllLessons = async () => {
  return  serverFetch("/api/all/public/lessons");
};

export const getFeaturedLesson = async ()=>{
  return serverFetch("/api/public/featured/lesson");
}

export async function getLessonById(id) {
  return  authorizeServerFetch(`/api/all/public/lessons/details/${id}`);
}

export const getUserStats = async () => {
  return  authorizeServerFetch(`/api/users/stats`);
};



export async function getLessons({ category = "", emotionalTone = "", search = "", currentPageNumber = "", limit = "", sort = "newest" } = {}) {
  const query = new URLSearchParams({ category, emotionalTone, search, currentPageNumber, limit, sort });
  console.log(query.toString(), "get all query");
  return  serverFetch(`/api/all/public/lessons?${query.toString()}`);
}

export const getUserLesson = async(id)=>{
  return  authorizeServerFetch(`/api/lessons/my-lessons/${id}`);
}

export const getMyFavoritesLesson = async(userId)=>{
  return  authorizeServerFetch(`/api/lesson/my-favorites/${userId}`);
}

export const getComments = async (userId)=>{
  return  authorizeServerFetch(`/api/comments/${userId}`);
}





