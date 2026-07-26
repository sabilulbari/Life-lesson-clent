"use server";

import { serverMutation } from "../core/server";

export const createLesson = async (data) => {
  return await serverMutation("/api/user/dashboard/add/lesson", data);
};
