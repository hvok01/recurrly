import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import "../../global.css";
import { getHasSignedInBefore, setHasSignedInBefore } from '../../lib/hasSignedInBefore';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootLayoutContent() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [storageReady, setStorageReady] = useState(false);
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  const [fontsLoaded] = useFonts({
    'sans-regular': require('../../assets/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../../assets/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../../assets/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../../assets/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../../assets/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../../assets/assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    let cancelled = false;
    getHasSignedInBefore().finally(() => {
      if (!cancelled) setStorageReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      void setHasSignedInBefore(true);
    }
  }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (fontsLoaded && authLoaded && storageReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded, storageReady]);

  if (!fontsLoaded || !authLoaded || !storageReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  )
}
