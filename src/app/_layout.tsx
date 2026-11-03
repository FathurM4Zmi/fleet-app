import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppStoreProvider } from '@/store/app';
import { AuthProvider, useAuth } from '@/store/auth';
import { colors } from '@/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Keep the native splash up until the Inter faces are ready, so text never
// reflows from a fallback font.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AppStoreProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppStoreProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { status } = useAuth();

  // Wait for the stored token to be read before choosing a stack, otherwise a
  // signed-in driver briefly sees the login screen on cold start.
  if (status === 'loading') return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      {/*
        `redirectTo` must point to a route OUTSIDE the protected group. Pointing it
        at a screen in the same group makes the router navigate to a route the
        guard has just disabled; that route redirects again to the same target and
        React reports the loop as "Maximum update depth exceeded". So each guard
        redirects to the *other* stack, which is accessible when it fires.
      */}
      <Stack.Protected guard={status === 'authenticated'} redirectTo="/(auth)/login">
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={status !== 'authenticated'} redirectTo="/(app)/(tabs)">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
