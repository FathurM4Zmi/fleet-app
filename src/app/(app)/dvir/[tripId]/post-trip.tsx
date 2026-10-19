import { useLocalSearchParams } from 'expo-router';

import { DvirForm } from '@/components/DvirForm';
import { EmptyState, Screen, ScreenHeader } from '@/components/ui';

export default function DvirPostTripScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  if (!tripId) {
    return (
      <Screen>
        <ScreenHeader title="Inspeksi Pasca Perjalanan" onBack />
        <EmptyState icon="error" title="Trip tidak ditemukan" description="Kembali dan pilih trip." />
      </Screen>
    );
  }

  return <DvirForm tripId={tripId} type="post" />;
}
