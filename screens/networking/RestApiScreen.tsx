import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import apiClient, { clearLogs, getRecentLogs, type LogEntry } from '@/lib/api-client';

type Post = { id: number; title: string; body: string };

const LOG_COLORS: Record<LogEntry['type'], string> = {
  request: '#0a7ea4',
  response: '#32b432',
  error: '#dc3232',
};

const GetExample = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchPosts = useCallback(async () => {
    setStatus('loading');
    setError('');
    clearLogs();
    try {
      const { data } = await apiClient.get<Post[]>('/posts', {
        params: { _limit: 10 },
      });
      setPosts(data);
      setStatus('success');
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
      setStatus('error');
    }
    setLogs(getRecentLogs());
  }, []);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>GET Request</ThemedText>

      <Pressable style={styles.button} onPress={fetchPosts}>
        <ThemedText style={styles.buttonText}>
          {status === 'loading' ? 'Fetching...' : 'Fetch Posts'}
        </ThemedText>
      </Pressable>

      {status === 'loading' && <ActivityIndicator style={styles.loader} color="#0a7ea4" />}

      {status === 'error' && (
        <View style={[styles.box, styles.errorBox]}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {status === 'success' && (
        <View style={styles.box}>
          <ThemedText type="defaultSemiBold">{posts.length} Posts</ThemedText>
          {posts.map((post) => (
            <View key={post.id} style={styles.postRow}>
              <ThemedText style={styles.postTitle}>{post.title}</ThemedText>
              <ThemedText style={styles.postBody} numberOfLines={1}>
                {post.body}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {logs.length > 0 && (
        <Collapsible title="Network Log">
          {logs.map((log) => (
            <ThemedText key={log.id} style={[styles.logEntry, { color: LOG_COLORS[log.type] }]}>
              [{log.timestamp}] {log.type.toUpperCase()}: {log.message}
            </ThemedText>
          ))}
        </Collapsible>
      )}

      <ThemedText style={styles.note}>
        GET /posts?_limit=10 fetches 10 posts from JSONPlaceholder. The request interceptor adds an
        Authorization header and logs the request. The response interceptor logs the status code.
      </ThemedText>
    </View>
  );
};

const PostExample = () => {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const createPost = useCallback(async () => {
    setStatus('loading');
    setError('');
    clearLogs();
    try {
      const { data } = await apiClient.post('/posts', {
        title: 'Demo Post Title',
        body: 'This post was created from the React Native Showcase app.',
        userId: 1,
      });
      setResponse(data as Record<string, unknown>);
      setStatus('success');
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
      setStatus('error');
    }
    setLogs(getRecentLogs());
  }, []);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>POST Request</ThemedText>

      <View style={styles.box}>
        <ThemedText type="defaultSemiBold">Request Payload</ThemedText>
        <ThemedText style={styles.codeText}>
          {JSON.stringify(
            { title: 'Demo Post Title', body: 'This post was created...', userId: 1 },
            null,
            2,
          )}
        </ThemedText>
      </View>

      <Pressable style={styles.button} onPress={createPost}>
        <ThemedText style={styles.buttonText}>
          {status === 'loading' ? 'Sending...' : 'Create Post'}
        </ThemedText>
      </Pressable>

      {status === 'loading' && <ActivityIndicator style={styles.loader} color="#0a7ea4" />}

      {status === 'error' && (
        <View style={[styles.box, styles.errorBox]}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {status === 'success' && response && (
        <View style={[styles.box, styles.successBox]}>
          <ThemedText type="defaultSemiBold">Response</ThemedText>
          <ThemedText style={styles.codeText}>{JSON.stringify(response, null, 2)}</ThemedText>
        </View>
      )}

      {logs.length > 0 && (
        <Collapsible title="Network Log">
          {logs.map((log) => (
            <ThemedText key={log.id} style={[styles.logEntry, { color: LOG_COLORS[log.type] }]}>
              [{log.timestamp}] {log.type.toUpperCase()}: {log.message}
            </ThemedText>
          ))}
        </Collapsible>
      )}

      <ThemedText style={styles.note}>
        POST /posts sends a JSON body. The interceptor automatically attaches the Authorization
        header (visible in logs). JSONPlaceholder returns the created object with a generated id.
      </ThemedText>
    </View>
  );
};

export default function RestApiScreen() {
  const [mode, setMode] = useState<'get' | 'post'>('get');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              This screen demonstrates Axios with a shared API client configured with request and
              response interceptors. Interceptors run on every request — useful for auth tokens,
              logging, and error normalization.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'get' && styles.tabActive]}
            onPress={() => setMode('get')}>
            <ThemedText style={mode === 'get' && styles.tabTextActive}>GET</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'post' && styles.tabActive]}
            onPress={() => setMode('post')}>
            <ThemedText style={mode === 'post' && styles.tabTextActive}>POST</ThemedText>
          </Pressable>
        </View>

        {mode === 'get' ? <GetExample /> : <PostExample />}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  noteContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  noteParagraph: { marginBottom: 8 },
  tabs: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  tabActive: { borderColor: '#0a7ea4', backgroundColor: 'rgba(10,126,164,0.15)' },
  tabTextActive: { color: '#0a7ea4', fontWeight: '600' },
  example: { gap: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  box: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  errorBox: { backgroundColor: 'rgba(220,50,50,0.1)', borderColor: 'rgba(220,50,50,0.3)' },
  successBox: { backgroundColor: 'rgba(50,180,50,0.1)', borderColor: 'rgba(50,180,50,0.3)' },
  errorText: { color: '#dc3232' },
  button: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  buttonText: { color: '#0a7ea4', fontWeight: '600' },
  note: { marginTop: 12, fontSize: 13, opacity: 0.9 },
  loader: { marginVertical: 8 },
  postRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
  },
  postTitle: { fontWeight: '600', fontSize: 14 },
  postBody: { fontSize: 13, opacity: 0.7, marginTop: 2 },
  codeText: { fontSize: 12, fontFamily: 'monospace', marginTop: 4, opacity: 0.8 },
  logEntry: { fontSize: 12, fontFamily: 'monospace', marginBottom: 2 },
});
