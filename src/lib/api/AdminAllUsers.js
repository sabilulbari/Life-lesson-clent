"use server";

import { authorizeServerFetch } from "../core/server";

export const getUserListOfAdmin = async () => {
  return authorizeServerFetch("/api/dashboard/admin/all/users");
};

export const getReports = async ()=>{
  return authorizeServerFetch("/api/reports");
}
export const getReportsDetails = async (lessonId) => {
  return authorizeServerFetch(`/api/reports/${lessonId}/details`);
};

export const getAdminAllUserLesson = async ({ category = "", visibility = "", isReviewed = "" } = {}) => {
  const query = new URLSearchParams({ category, visibility, isReviewed });
  return authorizeServerFetch(`/api/lessons/admin-all?${query.toString()}`);
};

export const getAdminStats = async()=>{
  return authorizeServerFetch(`/api/users/admin/stats`);
}

