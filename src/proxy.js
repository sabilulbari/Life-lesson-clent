import { NextResponse } from "next/server";
import { getUserSession } from "./lib/core/session";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
    const session = await getUserSession()

    console.log(session, "I am from proxy");
    if(!session){
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
  matcher: "/public-lessons/:id",
};
