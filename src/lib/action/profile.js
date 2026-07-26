"use server";

import { serverMutation } from "../core/server";

export const updateProfile = async (data) => {
  return await serverMutation("/api/user/dashboard/profile/update", data, "PATCH");
};
