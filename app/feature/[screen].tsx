import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FEATURE_SCREEN_REGISTRY } from '@/screens/feature-registry';

export default function FeatureScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const Component = screen ? FEATURE_SCREEN_REGISTRY[screen] : null;

  if (!Component) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">Coming soon</ThemedText>
        <ThemedText style={styles.hint}>{screen || 'Unknown screen'}</ThemedText>
      </ThemedView>
    );
  }

  return <Component />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
});
