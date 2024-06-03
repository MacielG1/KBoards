// import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

// export default authMiddleware({
//   publicRoutes: ["/"],

//   afterAuth(auth, req) {
//     if (auth?.userId && auth?.isPublicRoute) {
//       let path = "/dashboard";
//       const orgSelected = new URL(path, req.url);
//       return NextResponse.redirect(orgSelected);
//     }

//     if (!auth?.userId && !auth?.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }
//     if (auth.userId && !auth.isPublicRoute) {
//       return NextResponse.next();
//     }
//     // Allow users visiting public routes to access them
//     return NextResponse.next();
//   },
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/api/webhook"]);
const isPrivateRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, protect } = auth();

  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!userId && isPrivateRoute(req)) protect();

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
