'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithGoogle } from '@/firebase/auth/google-auth';

function GoogleIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35 11.1h-9.2v2.8h5.3c-.2 1.9-1.6 3.3-3.6 3.3-2.2 0-4-1.8-4-4s1.8-4 4-4c1.1 0 2.1.4 2.8 1.2l2.2-2.2C17.2 6.4 15 5.3 12.5 5.3c-3.9 0-7 3.1-7 7s3.1 7 7 7c4.1 0 6.7-2.8 6.7-6.8 0-.5 0-1-.1-1.5z"/>
      </svg>
    )
}

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithGoogle(auth);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-xl shadow-lg">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BarChart className="h-8 w-8 mr-2 text-primary" />
                <h1 className="text-3xl font-bold font-headline">VC-scenario</h1>
            </div>
            <p className="text-muted-foreground">
                Sign in to access your dashboard
            </p>
        </div>

        <Button
            variant="outline"
            className="w-full"
            onClick={handleSignIn}
        >
            <GoogleIcon />
            <span className="ml-2">Sign in with Google</span>
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
