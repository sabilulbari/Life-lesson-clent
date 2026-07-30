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

export const addLessonFevarite = async(id)=>{
  return serverMutation(`/api/lessons/${id}/favorite`, {}, "PATCH");
}
export const addLessonComment = async (lessonId, content) => {
  return serverMutation(`/api/comments`, { lessonId, content }, "POST");
};


export const addLessonReport = async (lessonId, lessonTitle, reason) => {
  return serverMutation(`/api/reports`, { lessonId, lessonTitle, reason }, "POST");
};