import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { FeatureItem } from '@/constants/features';
import { FEATURES } from '@/constants/features';

function FeatureRow({ item }: { item: FeatureItem }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => router.push({ pathname: '/feature/[id]', params: { id: item.screen } } as never)}>
      <ThemedText type="subtitle" style={styles.rowTitle}>
        {item.title}
      </ThemedText>
      <ThemedText numberOfLines={2} style={styles.rowDescription}>
        {item.description}
      </ThemedText>
      <ThemedText style={styles.rowLevel}>{item.level}</ThemedText>
    </Pressable>
  );
}

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = FEATURES.find((g) => g.id === id);

  const navigation = useNavigation();
  useEffect(() => {
    if (group) {
      navigation.setOptions({ title: group.title });
    }
  }, [group, navigation]);

  if (!group) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">Group not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {group.title}
        </ThemedText>
        <ThemedText style={styles.description}>{group.description}</ThemedText>
      </ThemedView>
      <FlatList
        data={group.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <FeatureRow item={item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  title: {
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.9,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  row: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.25)',
  },
  rowPressed: {
    opacity: 0.8,
  },
  rowTitle: {
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.9,
  },
  rowLevel: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
});
