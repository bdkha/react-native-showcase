import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FEATURES, type FeatureGroup } from '@/constants/features';

const NUM_COLUMNS = 2;

function GroupCard({ group }: { group: FeatureGroup }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } } as never)}>
      <ThemedText type="subtitle" style={styles.cardTitle} numberOfLines={2}>
        {group.title}
      </ThemedText>
      <ThemedText numberOfLines={2} style={styles.cardDescription}>
        {group.description}
      </ThemedText>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        React Native Showcase
      </ThemedText>
      <FlatList
        data={FEATURES}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        key="grid"
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <GroupCard group={item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    opacity: 0.85,
  },
});
