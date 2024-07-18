'use client';
import { useRouter } from 'next/navigation';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

function useSecureRoute() {
  const router = useRouter();

  //Securing route
  const { isLoading, isAuthenticated } = useKindeBrowserClient();
  if (!isLoading && !isAuthenticated) {
    router.replace('/api/auth/login');
  }
  return { loadingAuth: isLoading };
}

export default useSecureRoute;
