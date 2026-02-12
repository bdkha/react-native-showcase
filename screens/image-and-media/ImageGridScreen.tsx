import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const IMAGE_URL = 'https://picsum.photos/400/400';
const INITIAL_COUNT = 30;
const BATCH_SIZE = 30;
const MAX_COUNT = 180;
const ITEM_SIZE = 120;

type GridItem = {
  id: string;
  url: string;
};

function createItems(count: number, offset: number): GridItem[] {
  return Array.from({ length: count }, (_, i) => {
    const index = offset + i;
    return {
      id: `grid-image-${index}`,
      url: `${IMAGE_URL}?random=${index}`,
    };
  });
}

function ImageCell({ item }: { item: GridItem }) {
  return (
    <View style={styles.item}>
      <Image source={item.url} style={styles.image} contentFit="cover" />
    </View>
  );
}

export default function ImageGridScreen() {
  const [items, setItems] = useState<GridItem[]>(() => createItems(INITIAL_COUNT, 0));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const canLoadMore = items.length < MAX_COUNT;

  const loadMore = useCallback(() => {
    if (!canLoadMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setTimeout(() => {
      setItems((current) => {
        const nextOffset = current.length;
        const nextBatch = createItems(BATCH_SIZE, nextOffset);
        return [...current, ...nextBatch];
      });
      setIsLoadingMore(false);
    }, 300);
  }, [canLoadMore, isLoadingMore]);

  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => <ImageCell item={item} />,
    []
  );

  const keyExtractor = useCallback((item: GridItem) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            This screen renders a lazy loading image grid using remote images.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            The grid starts with a small batch of images and loads more as you scroll near the end.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            This pattern keeps memory usage under control while still providing a smooth, image-heavy
            experience.
          </ThemedText>
        </Collapsible>
      </View>
      <FlatList
        data={items}
        numColumns={3}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        windowSize={5}
        removeClippedSubviews
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ThemedText>Loading more...</ThemedText>
            </View>
          ) : null
        }
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
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});

