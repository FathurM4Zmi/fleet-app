import { Stack } from 'expo-router';
import { View } from 'react-native';

import { OfflineBanner } from '@/components/OfflineBanner';

/**
 * `(tabs)` is the anchor, so every pushed screen (trip detail, DVIR, POD)
 * covers the tab bar — matching the designs, where those screens use a back
 * arrow instead of the bottom navigation.
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function AppLayout() {
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="performance" />
      <Stack.Screen name="dna" />
      <Stack.Screen name="coaching" />
      <Stack.Screen name="coaching/update" options={{ presentation: 'modal' }} />
      <Stack.Screen name="compliance" />
      <Stack.Screen name="compliance/incident" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="settlement" />
      <Stack.Screen name="fuel" />
      <Stack.Screen name="fuel-card" />
      <Stack.Screen name="vehicle" />
      <Stack.Screen name="vehicle/odometer" options={{ presentation: 'modal' }} />
      <Stack.Screen name="vehicle/odometer/submitted" />
      <Stack.Screen name="damage" />
      <Stack.Screen name="safety" />
      <Stack.Screen name="notifications/[notificationId]" />
      <Stack.Screen name="documents/[documentKey]" />
      <Stack.Screen name="trip/[tripId]/index" />
      <Stack.Screen name="trip/[tripId]/execution" />
      <Stack.Screen name="trip/[tripId]/reject" options={{ presentation: 'modal' }} />
      <Stack.Screen name="trip/[tripId]/route" />
      <Stack.Screen name="trip/[tripId]/routes" />
      <Stack.Screen name="trip/[tripId]/warnings" />
      <Stack.Screen name="trip/[tripId]/assets" />
      <Stack.Screen name="trip/[tripId]/chat" />
      <Stack.Screen name="dvir/[tripId]/pre-trip" />
      <Stack.Screen name="dvir/[tripId]/post-trip" />
      <Stack.Screen name="dvir/[tripId]/submitted" />
      <Stack.Screen name="dvir/[tripId]/work-order" />
      <Stack.Screen name="dvir/[tripId]/history" />
      <Stack.Screen name="pod/[tripId]/capture" />
      <Stack.Screen name="pod/[tripId]/success" />
      </Stack>
    </View>
  );
}
