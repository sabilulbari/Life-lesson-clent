"use server"

import { serverMutatoion } from "../core/server"

export const createLesson = async (data) => {
  return await serverMutatoion("/api/user/dashboard/add/lesson", data);
};