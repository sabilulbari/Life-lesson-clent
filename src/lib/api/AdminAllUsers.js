"use server";

import { authorizeServerFetch } from "../core/server";

export const getUserListOfAdmin = async () => {
  return authorizeServerFetch("/api/dashboard/admin/all/users", "admin");
};

export const getReports = async ()=>{
  return authorizeServerFetch("/api/reports", "admin");
}
export const getReportsDetails = async (lessonId) => {
  return authorizeServerFetch(`/api/reports/${lessonId}/details`, "admin");
};


