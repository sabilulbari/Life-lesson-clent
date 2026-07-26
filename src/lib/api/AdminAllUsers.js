"use server"

import { authorizeServerFetch } from "../core/server"

export const getAllUsersAdmin =async()=>{
    return authorizeServerFetch("/api/dashboard/admin/all/users", "admin")
}