import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';

const NOTES = ['Hello World', 'Zustand is great', 'Persist all the things', 'React Native rocks'];

type DemoState = {
  counter: number;
  note: string;
  increment: () => void;
  cycleNote: () => void;
  reset: () => void;
};

const useVolatileStore = create<DemoState>((set) => ({
  counter: 0,
  note: 'Hello World',
  increment: () => set((s) => ({ counter: s.counter + 1 })),
  cycleNote: () =>
    set((s) => {
      const idx = (NOTES.indexOf(s.note) + 1) % NOTES.length;
      return { note: NOTES[idx] };
    }),
  reset: () => set({ counter: 0, note: 'Hello World' }),
}));

const usePersistedStore = create<DemoState>()(
  persist(
    (set) => ({
      counter: 0,
      note: 'Hello World',
      increment: () => set((s) => ({ counter: s.counter + 1 })),
      cycleNote: () =>
        set((s) => {
          const idx = (NOTES.indexOf(s.note) + 1) % NOTES.length;
          return { note: NOTES[idx] };
        }),
      reset: () => set({ counter: 0, note: 'Hello World' }),
    }),
    {
      name: 'persist-demo',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ counter: state.counter, note: state.note }),
    },
  ),
);

const CounterBox = React.memo(({ value, tag }: { value: number; tag: string }) => {
  const renders = useRenderCount(`${tag}Counter`);
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Counter</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const NoteBox = React.memo(({ value, tag }: { value: string; tag: string }) => {
  const renders = useRenderCount(`${tag}Note`);
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Note</ThemedText>
      <ThemedText>{value}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const VolatileDemo = () => {
  const counter = useVolatileStore((s) => s.counter);
  const note = useVolatileStore((s) => s.note);
  const increment = useVolatileStore((s) => s.increment);
  const cycleNote = useVolatileStore((s) => s.cycleNote);

  useEffect(() => {
    useVolatileStore.setState({ counter: 0, note: 'Hello World' });
  }, []);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Non-Persisted Store</ThemedText>

      <CounterBox value={counter} tag="Volatile" />
      <NoteBox value={note} tag="Volatile" />

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={increment}>
          <ThemedText style={styles.buttonText}>+ Increment</ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={cycleNote}>
          <ThemedText style={styles.buttonText}>Cycle Note</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.note}>
        This is a regular Zustand store. State lives only in memory and resets when the component
        remounts or the app restarts.
      </ThemedText>
    </View>
  );
};

const HydrationBadge = () => {
  const [hydrated, setHydrated] = useState(usePersistedStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = usePersistedStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return (
    <View style={[styles.badge, hydrated ? styles.badgeSuccess : styles.badgeLoading]}>
      <ThemedText style={styles.badgeText}>{hydrated ? 'Hydrated' : 'Hydrating...'}</ThemedText>
    </View>
  );
};

const PersistedDemo = () => {
  const counter = usePersistedStore((s) => s.counter);
  const note = usePersistedStore((s) => s.note);
  const increment = usePersistedStore((s) => s.increment);
  const cycleNote = usePersistedStore((s) => s.cycleNote);
  const reset = usePersistedStore((s) => s.reset);

  const handleClearStorage = async () => {
    await AsyncStorage.removeItem('persist-demo');
    reset();
  };

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Persisted Store</ThemedText>

      <HydrationBadge />
      <CounterBox value={counter} tag="Persisted" />
      <NoteBox value={note} tag="Persisted" />

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={increment}>
          <ThemedText style={styles.buttonText}>+ Increment</ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={cycleNote}>
          <ThemedText style={styles.buttonText}>Cycle Note</ThemedText>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleClearStorage}>
        <ThemedText style={styles.buttonText}>Clear Storage & Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        This store uses Zustand's persist middleware with AsyncStorage. State is automatically saved
        on every change and restored when the store initializes. Try changing values, then leave and
        return to this screen — your data persists.
      </ThemedText>
    </View>
  );
};

export default function PersistStateScreen() {
  const [mode, setMode] = useState<'volatile' | 'persisted'>('volatile');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              State persistence allows app data to survive restarts. Zustand's persist middleware
              serializes state to AsyncStorage automatically.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              The Non-Persisted tab resets on remount. The Persisted tab restores values from
              AsyncStorage via hydration, so your changes survive navigation and app restarts.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'volatile' && styles.tabActive]}
            onPress={() => setMode('volatile')}>
            <ThemedText style={mode === 'volatile' && styles.tabTextActive}>Non-Persisted</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'persisted' && styles.tabActive]}
            onPress={() => setMode('persisted')}>
            <ThemedText style={mode === 'persisted' && styles.tabTextActive}>Persisted</ThemedText>
          </Pressable>
        </View>

        {mode === 'volatile' ? <VolatileDemo /> : <PersistedDemo />}
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
  value: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 4,
  },
  renderBadge: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(50,180,50,0.15)',
  },
  badgeLoading: {
    backgroundColor: 'rgba(10,126,164,0.15)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
