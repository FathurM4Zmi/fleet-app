import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'login',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="scan-qr" />
      <Stack.Screen name="reset-pin" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
