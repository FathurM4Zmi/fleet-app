import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui';
import { colors } from '@/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tidak ditemukan' }} />
      <EmptyState
        icon="error"
        title="Halaman tidak ditemukan"
        description="Tautan yang Anda buka tidak tersedia atau sudah dipindahkan."
      />
      <Link href="/" style={styles.link}>
        Kembali ke beranda
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
    padding: 24,
  },
  link: { marginTop: 8, color: colors.primaryContainer },
});
