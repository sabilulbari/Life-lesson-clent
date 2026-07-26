"use server"

import { authorizeServerFetch } from "../core/server"

export const getUserListOfAdmin =async()=>{
    return authorizeServerFetch("/api/dashboard/admin/all/users", "admin")
}