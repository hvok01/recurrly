import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getHasSignedInBefore } from '../../lib/hasSignedInBefore';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSignedInBefore, setHasSignedInBeforeState] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    getHasSignedInBefore().then((v) => {
      if (!cancelled) {
        setHasSignedInBeforeState(v);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !ready) return;
    if (isSignedIn) {
      router.replace('/(tabs)');
    } else if (hasSignedInBefore) {
      router.replace('/(auth)/sign-in');
    } else {
      router.replace('/onboarding');
    }
  }, [isLoaded, ready, isSignedIn, hasSignedInBefore, router]);

  return null;
}
