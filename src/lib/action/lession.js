"use server";

import { authorizeServerFetch, serverMutation } from "../core/server";

export const createLesson = async (data) => {
  return await serverMutation("/api/user/dashboard/add/lesson", data);
};

export const removeMyFavoritesLesson = async (userId) => {
  return serverMutation(`/api/lessons/${userId}/favorite`, {}, "PATCH");
};

export const addLessonLike = async (id) =>{
  return serverMutation(`/api/lessons/${id}/like`, {}, "PATCH" );
}

export const addLessonFavorite = async(id)=>{
  return serverMutation(`/api/lessons/${id}/favorite`, {}, "PATCH");
}
export const addLessonComment = async (lessonId, content) => {
  return serverMutation(`/api/comments`, { lessonId, content });
};


export const addLessonReport = async (lessonId, lessonTitle, reason) => {
  return serverMutation(`/api/reports`, { lessonId, lessonTitle, reason });
};

export const updateLesson = async (id, data)=>{
  return serverMutation(`/api/lessons/${id}`, {data}, "PUT");
}

export const deleteUserLesson = async(id)=>{
  return serverMutation(`/api/lessons/${id}`, {}, "DELETE");
} 