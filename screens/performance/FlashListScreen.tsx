import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';

const ROW_HEIGHT = 72;
const DATA = Array.from({ length: 5000 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
  subtitle: `Row ${i + 1} of 5000`,
}));

const FlatListRow = React.memo(function FlatListRow({
  item,
}: {
  item: (typeof DATA)[0];
}) {
  return (
    <View style={styles.row}>
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
    </View>
  );
});

function FlashListRow({ item }: { item: (typeof DATA)[0] }) {
  return (
    <View style={styles.row}>
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
    </View>
  );
}

export default function FlashListScreen() {
  const [activeTab, setActiveTab] = useState<'flatlist' | 'flashlist'>('flatlist');

  const renderFlatListItem = useCallback(
    ({ item }: { item: (typeof DATA)[0] }) => <FlatListRow item={item} />,
    []
  );

  const renderFlashListItem = useCallback(
    ({ item }: { item: (typeof DATA)[0] }) => <FlashListRow item={item} />,
    []
  );

  const keyExtractor = useCallback((item: (typeof DATA)[0]) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            This screen compares an optimized FlatList with FlashList when rendering a large
            dataset.
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.noteHeading}>
            FlatList version:
          </ThemedText>
          <ThemedText style={styles.noteBullet}>- Uses memoized items and stable callbacks</ThemedText>
          <ThemedText style={styles.noteBullet}>
            - Applies getItemLayout and tuned rendering parameters
          </ThemedText>
          <ThemedText style={styles.noteBullet}>
            - Performs well, but still has limitations with very large lists
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.noteHeading}>
            FlashList version:
          </ThemedText>
          <ThemedText style={styles.noteBullet}>- Uses a different virtualization engine</ThemedText>
          <ThemedText style={styles.noteBullet}>- Renders fewer items overall</ThemedText>
          <ThemedText style={styles.noteBullet}>
            - Provides smoother scrolling and faster initial rendering
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            This demo highlights when switching from FlatList to FlashList is a better choice in
            production applications.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            Scroll about 100-200 items to see the difference.
          </ThemedText>
        </Collapsible>
      </View>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'flatlist' && styles.tabActive]}
          onPress={() => setActiveTab('flatlist')}>
          <ThemedText style={activeTab === 'flatlist' && styles.tabTextActive}>FlatList</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'flashlist' && styles.tabActive]}
          onPress={() => setActiveTab('flashlist')}>
          <ThemedText style={activeTab === 'flashlist' && styles.tabTextActive}>FlashList</ThemedText>
        </Pressable>
      </View>
      {activeTab === 'flatlist' && (
        <FlatList
          data={DATA}
          keyExtractor={keyExtractor}
          renderItem={renderFlatListItem}
          getItemLayout={getItemLayout}
          style={styles.list}
          initialNumToRender={15}
          windowSize={5}
          maxToRenderPerBatch={10}
        />
      )}
      {activeTab === 'flashlist' && (
        <FlashList
          data={DATA}
          renderItem={renderFlashListItem}
          keyExtractor={keyExtractor}
          style={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  noteParagraph: {
    marginBottom: 8,
  },
  noteHeading: {
    marginTop: 8,
    marginBottom: 4,
  },
  noteBullet: {
    fontSize: 14,
    marginLeft: 4,
  },
  tabs: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  tabActive: {
    borderColor: '#0a7ea4',
    backgroundColor: 'rgba(10,126,164,0.15)',
  },
  tabTextActive: {
    color: '#0a7ea4',
  },
  list: {
    flex: 1,
  },
  row: {
    padding: 16,
    minHeight: ROW_HEIGHT,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
});
