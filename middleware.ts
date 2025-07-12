import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: [
    "/((?!api/auth|api/util|api/ml|_next|static|login|favicon.ico|$).*)",
  ],
}

