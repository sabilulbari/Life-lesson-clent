"use server"

import { serverMutatoion } from "../core/server"

export const submitPricingData = async(data) =>{
    return serverMutatoion("/api/pricing", data)
}