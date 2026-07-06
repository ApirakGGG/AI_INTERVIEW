import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Matcher ที่เป็น Public เวลาtest postman จะไม่ต้อง Log in
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhooks(.*)', 
  '/api/getUsers(.*)',
  '/api/summary(.*)',
  '/api/deleteInterview(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};