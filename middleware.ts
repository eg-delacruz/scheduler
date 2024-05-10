import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return NextResponse.redirect(
      //This url is the one needed by Kinde to redirect the authenticated user right after login
      new URL('/api/auth/login?post_login_redirect_url=/dashboard', request.url)
    );
  }
}

//TODO: check that all protected routes are here
// Protected routes
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/create-business'],
};
