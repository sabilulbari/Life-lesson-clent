"use server";

import { authorizeServerFetch, serverMutation } from "../core/server";

export const createLesson = async (data) => {
  return await authorizeServerFetch("/api/user/dashboard/add/lesson", data);
};

export const removeMyFavoritesLesson = async (userId) => {
  return serverMutation(`/api/lessons/${userId}/favorite`, {}, "PATCH");
};

export const addLessonLike = async (id) =>{
  return serverMutation(`/api/lessons/${id}/like`, {}, "PATCH" );
}