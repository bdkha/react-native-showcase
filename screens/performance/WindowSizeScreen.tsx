import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DATA = Array.from({ length: 300 }, (_, i) => ({ id: `w-${i}`, label: `Item ${i + 1}` }));
const ITEM_HEIGHT = 52;

function Row({ item }: { item: { id: string; label: string } }) {
  return (
    <View style={styles.row}>
      <ThemedText>{item.label}</ThemedText>
    </View>
  );
}

export default function WindowSizeScreen() {
  const [windowSize, setWindowSize] = useState(5);
  const [maxToRender, setMaxToRender] = useState(10);

  const renderItem = useCallback(({ item }: { item: { id: string; label: string } }) => {
    return <Row item={item} />;
  }, []);

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
      <ThemedView style={styles.controls}>
        <ThemedView style={styles.controlRow}>
          <ThemedText>windowSize: {windowSize}</ThemedText>
          <View style={styles.buttons}>
            {[3, 5, 11, 21].map((n) => (
              <ThemedText
                key={n}
                style={[styles.controlBtn, windowSize === n && styles.controlBtnActive]}
                onPress={() => setWindowSize(n)}>
                {n}
              </ThemedText>
            ))}
          </View>
        </ThemedView>
        <ThemedView style={styles.controlRow}>
          <ThemedText>maxToRenderPerBatch: {maxToRender}</ThemedText>
          <View style={styles.buttons}>
            {[5, 10, 20, 50].map((n) => (
              <ThemedText
                key={n}
                style={[styles.controlBtn, maxToRender === n && styles.controlBtnActive]}
                onPress={() => setMaxToRender(n)}>
                {n}
              </ThemedText>
            ))}
          </View>
        </ThemedView>
      </ThemedView>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        windowSize={windowSize}
        maxToRenderPerBatch={maxToRender}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  controlRow: {
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  controlBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    overflow: 'hidden',
  },
  controlBtnActive: {
    borderColor: '#0a7ea4',
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
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
});
