"use server";

import { authorizeServerFetch, serverMutation } from "../core/server";

export const getUserListOfAdmin = async () => {
  return authorizeServerFetch("/api/dashboard/admin/all/users", "admin");
};

export const updateRoleByAdmin = async (targetUserId, newRole) => {
  const data = { targetUserId, newRole };
  return serverMutation("/api/users/admin/role", data, "PATCH");
};

export const deleteUserAcc = async (targetId)=>{
    return serverMutation(`/api/users/admin/${targetId}`, null, "DELETE");
}
