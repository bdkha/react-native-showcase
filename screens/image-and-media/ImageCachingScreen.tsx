import { Image as ExpoImage } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { FlatList, Image as RNImage, Pressable, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';

const IMAGE_URL = 'https://picsum.photos/400/400';
const DATA = Array.from({ length: 60 }, (_, i) => ({
  id: `image-${i}`,
  url: `${IMAGE_URL}?random=${i}`,
}));
const ITEM_SIZE = 120;

type DataItem = (typeof DATA)[0];

function TextOverlay({ text }: { text: string }) {
  return (
    <View style={styles.overlay}>
      <ThemedText style={styles.overlayText}>{text}</ThemedText>
    </View>
  );
}

function BadImageItem({ url }: { url: string }) {
  const renders = useRenderCount('BadImageItem');

  return (
    <View style={styles.item}>
      <RNImage source={{ uri: url }} style={styles.image} resizeMode="cover" />
      <TextOverlay text={`Renders: ${renders}`} />
    </View>
  );
}

const OptimizedImageItem = React.memo(function OptimizedImageItem({ url }: { url: string }) {
  const renders = useRenderCount('OptimizedImageItem');

  return (
    <View style={styles.item}>
      <ExpoImage
        source={url}
        style={styles.image}
        contentFit="cover"
        cachePolicy="disk"
      />
      <TextOverlay text={`Renders: ${renders}`} />
    </View>
  );
});

export default function ImageCachingScreen() {
  const [mode, setMode] = useState<'bad' | 'optimized'>('bad');

  const renderBadItem = useCallback(
    ({ item }: { item: DataItem }) => <BadImageItem url={item.url} />,
    []
  );

  const renderOptimizedItem = useCallback(
    ({ item }: { item: DataItem }) => <OptimizedImageItem url={item.url} />,
    []
  );

  const keyExtractor = useCallback((item: DataItem) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            This screen compares image loading behavior with and without caching.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            The bad example uses the default React Native Image component, which may re-fetch images
            during re-renders or fast scrolling.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            The optimized example uses a cached image solution, reducing network requests, memory
            churn, and UI jank.
          </ThemedText>
        </Collapsible>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === 'bad' && styles.tabActive]}
          onPress={() => setMode('bad')}>
          <ThemedText style={mode === 'bad' && styles.tabTextActive}>No Cache</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === 'optimized' && styles.tabActive]}
          onPress={() => setMode('optimized')}>
          <ThemedText style={mode === 'optimized' && styles.tabTextActive}>Cached</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={DATA}
        key={mode}
        numColumns={3}
        renderItem={mode === 'bad' ? renderBadItem : renderOptimizedItem}
        keyExtractor={keyExtractor}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: 16,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overlayText: {
    fontSize: 10,
    color: '#fff',
  },
});
