import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
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
    autoSignIn: false,
    minPasswordLength: 6,
    maxPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user" // "user" or "admin"
      },
      plan: {
        type: "string",
        defaultValue: "free"
      }
    }
  },
  session:{
    cookieCache: {
      enabled: true,
      maxAge: 50 * 60,
      strategy: "jwt"
    }
  },

  plugins: [jwt()]
});
export default auth;
