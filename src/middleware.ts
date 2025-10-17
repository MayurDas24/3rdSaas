import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/signin" },
});

export const config = {
  matcher: ["/checkout"], // only checkout requires auth; dashboard free mode is open
};
