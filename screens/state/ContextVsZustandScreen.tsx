import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { create } from 'zustand';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRenderCount } from '@/hooks/use-rerender-count';

type AppState = {
  counter: number;
  label: string;
  incrementCounter: () => void;
  changeLabel: () => void;
};

const AppContext = React.createContext<AppState>({} as AppState);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [counter, setCounter] = useState(0);
  const [label, setLabel] = useState('Hello');

  const incrementCounter = useCallback(() => setCounter((c) => c + 1), []);
  const changeLabel = useCallback(
    () => setLabel((l) => (l === 'Hello' ? 'World' : 'Hello')),
    [],
  );

  const value = useMemo(
    () => ({ counter, label, incrementCounter, changeLabel }),
    [counter, label, incrementCounter, changeLabel],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const ContextCounterDisplay = React.memo(() => {
  const { counter } = useContext(AppContext);
  const renders = useRenderCount('ContextCounter');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Counter Display</ThemedText>
      <ThemedText>Value: {counter}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ContextLabelDisplay = React.memo(() => {
  const { label } = useContext(AppContext);
  const renders = useRenderCount('ContextLabel');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Label Display</ThemedText>
      <ThemedText>Value: {label}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ContextStaticDisplay = React.memo(() => {
  useContext(AppContext);
  const renders = useRenderCount('ContextStatic');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Static Display</ThemedText>
      <ThemedText>Does not use any state value</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ContextExample = () => {
  return (
    <AppProvider>
      <ContextExampleInner />
    </AppProvider>
  );
};

const ContextExampleInner = () => {
  const { incrementCounter, changeLabel } = useContext(AppContext);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Context Approach</ThemedText>

      <ContextCounterDisplay />
      <ContextLabelDisplay />
      <ContextStaticDisplay />

      <Pressable style={styles.button} onPress={incrementCounter}>
        <ThemedText style={styles.buttonText}>Increment Counter</ThemedText>
      </Pressable>
      <Pressable style={styles.button} onPress={changeLabel}>
        <ThemedText style={styles.buttonText}>Change Label</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        All three components re-render when any value changes, because useContext subscribes to the
        entire context object. React.memo cannot prevent this.
      </ThemedText>
    </View>
  );
};

const useStore = create<AppState>((set) => ({
  counter: 0,
  label: 'Hello',
  incrementCounter: () => set((s) => ({ counter: s.counter + 1 })),
  changeLabel: () => set((s) => ({ label: s.label === 'Hello' ? 'World' : 'Hello' })),
}));

const ZustandCounterDisplay = React.memo(() => {
  const counter = useStore((s) => s.counter);
  const renders = useRenderCount('ZustandCounter');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Counter Display</ThemedText>
      <ThemedText>Value: {counter}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ZustandLabelDisplay = React.memo(() => {
  const label = useStore((s) => s.label);
  const renders = useRenderCount('ZustandLabel');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Label Display</ThemedText>
      <ThemedText>Value: {label}</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ZustandStaticDisplay = React.memo(() => {
  useStore(() => null);
  const renders = useRenderCount('ZustandStatic');
  return (
    <View style={styles.box}>
      <ThemedText type="defaultSemiBold">Static Display</ThemedText>
      <ThemedText>Does not use any state value</ThemedText>
      <ThemedText style={styles.renderBadge}>Renders: {renders}</ThemedText>
    </View>
  );
});

const ZustandExample = () => {
  useEffect(() => {
    useStore.setState({ counter: 0, label: 'Hello' });
  }, []);

  const incrementCounter = useStore((s) => s.incrementCounter);
  const changeLabel = useStore((s) => s.changeLabel);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Zustand Approach</ThemedText>

      <ZustandCounterDisplay />
      <ZustandLabelDisplay />
      <ZustandStaticDisplay />

      <Pressable style={styles.button} onPress={incrementCounter}>
        <ThemedText style={styles.buttonText}>Increment Counter</ThemedText>
      </Pressable>
      <Pressable style={styles.button} onPress={changeLabel}>
        <ThemedText style={styles.buttonText}>Change Label</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        Only the component whose selected slice changed will re-render. The static component never
        re-renders after mount.
      </ThemedText>
    </View>
  );
};

export default function ContextVsZustandScreen() {
  const [mode, setMode] = useState<'context' | 'zustand'>('context');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              This demo compares re-render behavior between React Context and Zustand.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              With Context, updating any value re-renders ALL consumers, even those that do not use
              the changed value.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              With Zustand, selector-based subscriptions ensure only the component reading the
              changed slice re-renders.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'context' && styles.tabActive]}
            onPress={() => setMode('context')}>
            <ThemedText style={mode === 'context' && styles.tabTextActive}>Context</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'zustand' && styles.tabActive]}
            onPress={() => setMode('zustand')}>
            <ThemedText style={mode === 'zustand' && styles.tabTextActive}>Zustand</ThemedText>
          </Pressable>
        </View>

        {mode === 'context' ? <ContextExample /> : <ZustandExample />}
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
  renderBadge: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
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
});
