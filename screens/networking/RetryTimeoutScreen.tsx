import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import axios from 'axios';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import apiClient from '@/lib/api-client';

type AttemptLog = {
  id: number;
  attempt: number;
  status: 'pending' | 'success' | 'fail';
  message: string;
  timestamp: string;
};

const TIMEOUT_OPTIONS = [500, 2000, 10000];

const TimeoutExample = () => {
  const [timeout, setTimeout_] = useState(2000);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState('');
  const [elapsed, setElapsed] = useState(0);

  const handleFetch = useCallback(async () => {
    setStatus('loading');
    setResult('');
    const start = Date.now();

    try {
      const { data } = await apiClient.get('/posts/1', { timeout });
      setElapsed(Date.now() - start);
      setResult(`Post: "${(data as { title: string }).title}"`);
      setStatus('success');
    } catch (e: any) {
      setElapsed(Date.now() - start);
      if (e.code === 'ECONNABORTED') {
        setResult(`Request timed out after ${timeout}ms`);
      } else {
        setResult(e.message ?? 'Unknown error');
      }
      setStatus('error');
    }
  }, [timeout]);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Timeout Control</ThemedText>

      <ThemedText style={styles.label}>Timeout (ms):</ThemedText>
      <View style={styles.optionRow}>
        {TIMEOUT_OPTIONS.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.optionButton, timeout === opt && styles.optionActive]}
            onPress={() => setTimeout_(opt)}>
            <ThemedText style={[styles.optionText, timeout === opt && styles.optionTextActive]}>
              {opt}ms
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleFetch}>
        <ThemedText style={styles.buttonText}>
          {status === 'loading' ? 'Fetching...' : 'Fetch with Timeout'}
        </ThemedText>
      </Pressable>

      {status === 'loading' && <ActivityIndicator style={styles.loader} color="#0a7ea4" />}

      {(status === 'success' || status === 'error') && (
        <View style={[styles.box, status === 'error' ? styles.errorBox : styles.successBox]}>
          <ThemedText style={status === 'error' ? styles.errorText : undefined}>
            {result}
          </ThemedText>
          <ThemedText style={styles.elapsedText}>Elapsed: {elapsed}ms</ThemedText>
        </View>
      )}

      <ThemedText style={styles.note}>
        The timeout parameter controls how long Axios waits before aborting. With 500ms, the request
        may timeout depending on network speed. 10000ms should succeed on most connections.
      </ThemedText>
    </View>
  );
};

const RetryExample = () => {
  const [maxRetries, setMaxRetries] = useState(3);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [logs, setLogs] = useState<AttemptLog[]>([]);
  const failCountRef = useRef(0);
  const logIdRef = useRef(0);

  const fetchWithRetry = useCallback(
    async (retries: number, delay: number) => {
      setStatus('running');
      setLogs([]);
      failCountRef.current = 0;
      logIdRef.current = 0;

      const failsBeforeSuccess = Math.min(retries, 2);

      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        const logEntry: AttemptLog = {
          id: ++logIdRef.current,
          attempt,
          status: 'pending',
          message: 'Requesting...',
          timestamp: new Date().toLocaleTimeString(),
        };
        setLogs((prev) => [...prev, logEntry]);

        try {
          if (failCountRef.current < failsBeforeSuccess) {
            failCountRef.current++;
            throw new Error('Simulated network failure');
          }

          const { data } = await apiClient.get('/posts/1');
          setLogs((prev) =>
            prev.map((l) =>
              l.id === logEntry.id
                ? {
                    ...l,
                    status: 'success' as const,
                    message: `OK — "${(data as { title: string }).title}"`,
                  }
                : l,
            ),
          );
          setStatus('done');
          return;
        } catch (e: any) {
          setLogs((prev) =>
            prev.map((l) =>
              l.id === logEntry.id
                ? { ...l, status: 'fail' as const, message: e.message ?? 'Failed' }
                : l,
            ),
          );

          if (attempt <= retries) {
            const backoff = delay * Math.pow(2, attempt - 1);
            await new Promise((r) => global.setTimeout(r, backoff));
          }
        }
      }
      setStatus('done');
    },
    [],
  );

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Retry with Backoff</ThemedText>

      <ThemedText style={styles.label}>Max retries:</ThemedText>
      <View style={styles.optionRow}>
        {[1, 2, 3].map((opt) => (
          <Pressable
            key={opt}
            style={[styles.optionButton, maxRetries === opt && styles.optionActive]}
            onPress={() => setMaxRetries(opt)}>
            <ThemedText style={[styles.optionText, maxRetries === opt && styles.optionTextActive]}>
              {opt}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.button, status === 'running' && styles.buttonDisabled]}
        onPress={() => fetchWithRetry(maxRetries, 500)}
        disabled={status === 'running'}>
        <ThemedText style={styles.buttonText}>
          {status === 'running' ? 'Retrying...' : 'Fetch with Retry'}
        </ThemedText>
      </Pressable>

      {logs.length > 0 && (
        <View style={styles.box}>
          <ThemedText type="defaultSemiBold">Attempt Log</ThemedText>
          {logs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View
                style={[
                  styles.logDot,
                  {
                    backgroundColor:
                      log.status === 'success'
                        ? '#32b432'
                        : log.status === 'fail'
                          ? '#dc3232'
                          : '#0a7ea4',
                  },
                ]}
              />
              <ThemedText style={styles.logText}>
                #{log.attempt} [{log.timestamp}] {log.message}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      <ThemedText style={styles.note}>
        The first 2 attempts are simulated failures, then a real API call succeeds. Exponential
        backoff increases delay between retries (500ms, 1000ms, 2000ms...) to avoid overwhelming
        the server.
      </ThemedText>
    </View>
  );
};

export default function RetryTimeoutScreen() {
  const [mode, setMode] = useState<'timeout' | 'retry'>('timeout');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              Network resilience requires handling timeouts and implementing retry strategies.
              Timeouts prevent the app from hanging on slow requests. Retry with exponential backoff
              handles transient failures gracefully.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'timeout' && styles.tabActive]}
            onPress={() => setMode('timeout')}>
            <ThemedText style={mode === 'timeout' && styles.tabTextActive}>Timeout</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'retry' && styles.tabActive]}
            onPress={() => setMode('retry')}>
            <ThemedText style={mode === 'retry' && styles.tabTextActive}>Retry</ThemedText>
          </Pressable>
        </View>

        {mode === 'timeout' ? <TimeoutExample /> : <RetryExample />}
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
  label: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  optionActive: { borderColor: '#0a7ea4', backgroundColor: 'rgba(10,126,164,0.15)' },
  optionText: { fontSize: 14 },
  optionTextActive: { color: '#0a7ea4', fontWeight: '600' },
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
  elapsedText: { fontSize: 13, opacity: 0.6, marginTop: 4 },
  button: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#0a7ea4', fontWeight: '600' },
  note: { marginTop: 12, fontSize: 13, opacity: 0.9 },
  loader: { marginVertical: 8 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  logDot: { width: 8, height: 8, borderRadius: 4 },
  logText: { fontSize: 13, flex: 1 },
});
