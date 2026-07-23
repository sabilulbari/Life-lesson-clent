"use server"

import { serverMutatoion } from "../core/server"

export const submitPricingData = async(data) =>{
    return await serverMutatoion("/api/pricing", data)
}