import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FEATURE_SCREEN_REGISTRY } from '@/screens/feature-registry';

export default function FeatureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const Component = id ? FEATURE_SCREEN_REGISTRY[id] : null;

  if (!Component) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">Coming soon</ThemedText>
        <ThemedText style={styles.hint}>{id || 'Unknown id'}</ThemedText>
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
