import { Redirect } from 'expo-router';

// This screen is intentionally disabled; redirect to the home screen.
export default function ExploreRedirect() {
  return <Redirect href="/(tabs)/index" />;
}
