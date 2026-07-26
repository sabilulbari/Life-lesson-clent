"use server";

import { serverMutation } from "../core/server";

export const submitPricingData = async (data) => {
  return await serverMutation("/api/pricing", data);
};
