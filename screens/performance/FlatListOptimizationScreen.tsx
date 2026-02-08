import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';

const ITEM_HEIGHT = 56;
const DATA = Array.from({ length: 200 }, (_, i) => ({ id: `item-${i}`, label: `Item ${i + 1}` }));

const BadRow = ({ item, isSelected, onSelect }: { item: { id: string; label: string }, isSelected: boolean , onSelect: (id: string) => void }) => {
  const renderCount = useRenderCount(`BadRow ${item.id}`);
  return (
    <TouchableOpacity style={[styles.row, isSelected && styles.rowSelected]} onPress={() => onSelect(item.id)}>
      <ThemedText>{item.label}</ThemedText>
      <ThemedText>Renders: {renderCount}</ThemedText>
      {isSelected && <ThemedText>Selected</ThemedText>}
    </TouchableOpacity>
  );
};

const OptimizedRow = React.memo(function OptimizedRow({
  item,
  isSelected,
  onSelect,
}: {
  item: { id: string; label: string };
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const renderCount = useRenderCount(`OptimizedRow ${item.id}`);
  return (
    <TouchableOpacity style={[styles.row, isSelected && styles.rowSelected]} onPress={() => onSelect(item.id)}>
      <ThemedText>{item.label}</ThemedText>
      <ThemedText>Renders: {renderCount}</ThemedText>
      {isSelected && <ThemedText>Selected</ThemedText>}
    </TouchableOpacity>
  );
});

export default function FlatListOptimizationScreen() {
  const [activeTab, setActiveTab] = useState<'bad' | 'optimized'>('bad');
  const [selectedId, setSelectedId] = useState<string | null>(null);


  const renderBadItem = 
    ({ item }: { item: { id: string; label: string } }) =>  <BadRow item={item} isSelected={selectedId === item.id} onSelect={setSelectedId} />


  const renderOptimizedItem = useCallback(
    ({ item }: { item: { id: string; label: string } }) => <OptimizedRow item={item} isSelected={selectedId === item.id} onSelect={setSelectedId} />,
    [selectedId, setSelectedId]
  );

  const keyExtractor = useCallback((item: { id: string; label: string }) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
        <ThemedText style={styles.noteParagraph}>
          This screen demonstrates a real-world FlatList performance issue.
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.noteHeading}>BAD version:</ThemedText>
        <ThemedText style={styles.noteBullet}>- Parent state passed to every item</ThemedText>
        <ThemedText style={styles.noteBullet}>- Inline callbacks and styles</ThemedText>
        <ThemedText style={styles.noteBullet}>- No memoization</ThemedText>
        <ThemedText style={styles.noteArrow}>→ All items re-render on each state change.</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.noteHeading}>OPTIMIZED version:</ThemedText>
        <ThemedText style={styles.noteBullet}>- Memoized items</ThemedText>
        <ThemedText style={styles.noteBullet}>- Stable callbacks</ThemedText>
        <ThemedText style={styles.noteBullet}>- Minimal props</ThemedText>
        <ThemedText style={styles.noteArrow}>→ Only affected items re-render.</ThemedText>
        </Collapsible>
      </View>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'bad' && styles.tabActive]}
          onPress={() => setActiveTab('bad')}>
          <ThemedText style={activeTab === 'bad' && styles.tabTextActive}>Bad</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'optimized' && styles.tabActive]}
          onPress={() => setActiveTab('optimized')}>
          <ThemedText style={activeTab === 'optimized' && styles.tabTextActive}>Optimized</ThemedText>
        </Pressable>
      </View>
      {activeTab === 'bad' && (
        <FlatList
          data={DATA}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBadItem}
          style={styles.list}
          initialNumToRender={15}
        />
      )}
      {activeTab === 'optimized' && (
        <FlatList
          data={DATA}
          keyExtractor={keyExtractor}
          renderItem={renderOptimizedItem}
          getItemLayout={getItemLayout}
          style={styles.list}
          initialNumToRender={15}
          windowSize={5}
          maxToRenderPerBatch={10}
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
  noteArrow: {
    fontSize: 14,
    marginLeft: 4,
    marginBottom: 4,
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
    height: ITEM_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  rowSelected: {
    backgroundColor: 'rgba(10,126,164,0.15)',
  },
});
