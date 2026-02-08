import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';
import { Collapsible } from '@/components/ui/collapsible';

const SCREEN_DESCRIPTION =
  'This screen visualizes component re-renders caused by state changes.\n\n' +
  'It demonstrates how poor state design can trigger unnecessary re-renders, even when UI output does not change.\n\n' +
  'By comparing different state management approaches, this demo helps identify the root causes of performance issues in React Native apps.';

const BadChild = ({ label }: { label: string }) => {
  const renders = useRenderCount(`BadChild ${label}`);

  return (
    <View style={styles.box}>
      <ThemedText>{label}</ThemedText>
      <ThemedText>Renders: {renders}</ThemedText>
    </View>
  );
};

const BadExample = () => {
  const parentRenders = useRenderCount('Bad Parent');
  const [counter, setCounter] = useState(0);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Bad State Design</ThemedText>
      <ThemedText>Parent renders: {parentRenders}</ThemedText>
      <ThemedText>Counter value: {counter}</ThemedText>

      <BadChild label="Child A" />
      <BadChild label="Child B" />

      <Pressable style={styles.button} onPress={() => setCounter((c) => c + 1)}>
        <ThemedText style={styles.buttonText}>Increment Counter</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        Even though Child A and Child B do not use the counter, they still re-render on every state
        change.
      </ThemedText>
    </View>
  );
};

const OptimizedChild = React.memo(({ label }: { label: string }) => {
  const renders = useRenderCount(`OptimizedChild ${label}`);

  return (
    <View style={styles.box}>
      <ThemedText>{label}</ThemedText>
      <ThemedText>Renders: {renders}</ThemedText>
    </View>
  );
});

const OptimizedExample = () => {
  const parentRenders = useRenderCount('Optimized Parent');
  const [, forceRender] = useState(0);

  const triggerParentRender = useCallback(() => {
    forceRender((c) => c + 1);
  }, []);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Optimized State Design</ThemedText>
      <ThemedText>Parent renders: {parentRenders}</ThemedText>

      <OptimizedChild label="Child A" />
      <OptimizedChild label="Child B" />

      <Pressable style={styles.button} onPress={triggerParentRender}>
        <ThemedText style={styles.buttonText}>Trigger Parent Re-render</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        Children are memoized and do not re-render unless their props actually change.
      </ThemedText>
    </View>
  );
};

export default function ReRenderTrackerScreen() {
  const [mode, setMode] = useState<'bad' | 'optimized'>('bad');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>{SCREEN_DESCRIPTION}</ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'bad' && styles.tabActive]}
            onPress={() => setMode('bad')}>
            <ThemedText style={mode === 'bad' && styles.tabTextActive}>Bad</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'optimized' && styles.tabActive]}
            onPress={() => setMode('optimized')}>
            <ThemedText style={mode === 'optimized' && styles.tabTextActive}>Optimized</ThemedText>
          </Pressable>
        </View>

        {mode === 'bad' ? <BadExample /> : <OptimizedExample />}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  infoBox: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
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
    fontWeight: '600',
  },
  example: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  box: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  button: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  buttonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    opacity: 0.9,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  noteParagraph: {
    marginBottom: 8,
  },
});
