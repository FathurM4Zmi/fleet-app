import { Redirect } from 'expo-router';

import { useAuth } from '@/store/app';

/** Entry route — sends the driver to the right stack based on the session. */
export default function Index() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? '/(app)/(tabs)' : '/(auth)/login'} />;
}
