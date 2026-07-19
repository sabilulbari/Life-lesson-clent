import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Setup MongoDB client for Better Auth
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

// Get the database instance. Mongoose creates "life-lessons" database, so we share it.
const dbName = "Life_lession";
const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret"
  //   }
  // },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user" // "user" or "admin"
      },
      plan: {
        type: "string",
        defaultValue: "free" // "free" or "premium"
      }
    }
  }
});
export default auth;
