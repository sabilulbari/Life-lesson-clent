"use server";

import { serverMutation } from "../core/server";


export const updateRoleByAdmin = async (targetUserId, newRole) => {
  const data = { targetUserId, newRole };
  return serverMutation("/api/users/admin/role", data, "PATCH");
};

export const deleteUserAcc = async (targetId) => {
  return serverMutation(`/api/users/admin/${targetId}`, null, "DELETE");
};

export const toggleFeatureLesson= async(id)=>{
    return serverMutation(`/api/lessons/${id}/feature`, {}, "PATCH");
}
