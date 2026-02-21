import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import apiClient from '@/lib/api-client';

type Post = { id: number; title: string; body: string };

const PAGE_SIZE = 10;

const PostItem = React.memo(({ post }: { post: Post }) => (
  <View style={styles.postItem}>
    <ThemedText style={styles.postId}>#{post.id}</ThemedText>
    <View style={styles.postContent}>
      <ThemedText style={styles.postTitle} numberOfLines={1}>
        {post.title}
      </ThemedText>
      <ThemedText style={styles.postBody} numberOfLines={2}>
        {post.body}
      </ThemedText>
    </View>
  </View>
));

export default function PaginationScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);

  const fetchPage = useCallback(async (start: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await apiClient.get<Post[]>('/posts', {
        params: { _start: start, _limit: PAGE_SIZE },
      });

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (isRefresh) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextStart = pageRef.current + PAGE_SIZE;
    pageRef.current = nextStart;
    fetchPage(nextStart);
  }, [loading, hasMore, fetchPage]);

  const handleRefresh = useCallback(() => {
    pageRef.current = 0;
    setHasMore(true);
    fetchPage(0, true);
  }, [fetchPage]);

  const renderFooter = () => {
    if (loading && posts.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color="#0a7ea4" />
          <ThemedText style={styles.footerText}>Loading more...</ThemedText>
        </View>
      );
    }
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>All posts loaded</ThemedText>
        </View>
      );
    }
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            Infinite scroll pagination using FlatList's onEndReached callback. Each page fetches 10
            posts from JSONPlaceholder using _start and _limit query parameters.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            Pull down to refresh and reset to the first page. The list stops loading when all 100
            posts are fetched.
          </ThemedText>
        </Collapsible>
      </View>

      <View style={styles.countBadge}>
        <ThemedText style={styles.countText}>
          {posts.length} posts loaded{hasMore ? '' : ' (all)'}
        </ThemedText>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostItem post={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  noteContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  noteParagraph: { marginBottom: 8 },
  countBadge: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(10,126,164,0.15)',
    alignSelf: 'flex-start',
  },
  countText: { fontSize: 13, fontWeight: '600', color: '#0a7ea4' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  postItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
    gap: 12,
  },
  postId: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.5,
    width: 32,
    paddingTop: 2,
  },
  postContent: { flex: 1 },
  postTitle: { fontWeight: '600', fontSize: 14, marginBottom: 2 },
  postBody: { fontSize: 13, opacity: 0.7 },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  footerText: { fontSize: 13, opacity: 0.6 },
});
