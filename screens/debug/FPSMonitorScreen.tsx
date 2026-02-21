import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  runOnJS,
  useFrameCallback,
} from 'react-native-reanimated';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type FPSSnapshot = {
  id: number;
  fps: number;
  timestamp: string;
};

const HEAVY_LIST_DATA = Array.from({ length: 500 }, (_, i) => ({
  id: String(i),
  label: `Item ${i} — ${'Lorem ipsum dolor sit amet '.repeat(3)}`,
}));

let snapId = 0;

const FPSGauge = ({ fps }: { fps: number }) => {
  const getFPSColor = (value: number) => {
    if (value >= 55) return '#32b432';
    if (value >= 30) return '#e6a700';
    return '#dc3232';
  };

  const getFPSLabel = (value: number) => {
    if (value >= 55) return 'Smooth';
    if (value >= 30) return 'Mild Jank';
    return 'Severe Jank';
  };

  const color = getFPSColor(fps);
  const barWidth = Math.min((fps / 60) * 100, 100);

  return (
    <View style={styles.gauge}>
      <View style={styles.gaugeHeader}>
        <ThemedText style={[styles.fpsValue, { color }]}>{fps}</ThemedText>
        <ThemedText style={styles.fpsUnit}>FPS</ThemedText>
        <ThemedText style={[styles.fpsLabel, { color }]}>{getFPSLabel(fps)}</ThemedText>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.barMarkers}>
        <ThemedText style={styles.markerText}>0</ThemedText>
        <ThemedText style={styles.markerText}>30</ThemedText>
        <ThemedText style={styles.markerText}>60</ThemedText>
      </View>
    </View>
  );
};

const FPSMonitor = () => {
  const [fps, setFps] = useState(60);
  const [monitoring, setMonitoring] = useState(false);
  const [history, setHistory] = useState<FPSSnapshot[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  const updateFps = useCallback((currentFps: number) => {
    setFps(currentFps);
    setHistory((prev) => {
      const snapshot: FPSSnapshot = {
        id: ++snapId,
        fps: currentFps,
        timestamp: new Date().toLocaleTimeString(),
      };
      return [snapshot, ...prev].slice(0, 30);
    });
  }, []);

  useFrameCallback((frameInfo) => {
    if (!monitoring) return;

    frameCountRef.current++;
    const now = frameInfo.timeSinceFirstFrame;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now;
      return;
    }

    const elapsed = now - lastTimeRef.current;
    if (elapsed >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
      runOnJS(updateFps)(Math.min(currentFps, 60));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  const toggleMonitoring = () => {
    if (monitoring) {
      setMonitoring(false);
    } else {
      frameCountRef.current = 0;
      lastTimeRef.current = 0;
      setMonitoring(true);
    }
  };

  const avgFps = history.length > 0
    ? Math.round(history.reduce((sum, s) => sum + s.fps, 0) / history.length)
    : 0;
  const minFps = history.length > 0
    ? Math.min(...history.map((s) => s.fps))
    : 0;

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>FPS Monitor</ThemedText>

      <FPSGauge fps={fps} />

      <Pressable
        style={[styles.button, monitoring && styles.stopButton]}
        onPress={toggleMonitoring}>
        <ThemedText style={[styles.buttonText, monitoring && styles.stopButtonText]}>
          {monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </ThemedText>
      </Pressable>

      {history.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statLabel}>Current</ThemedText>
            <ThemedText style={styles.statValue}>{fps}</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statLabel}>Average</ThemedText>
            <ThemedText style={styles.statValue}>{avgFps}</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statLabel}>Min</ThemedText>
            <ThemedText style={[styles.statValue, minFps < 30 && { color: '#dc3232' }]}>
              {minFps}
            </ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statLabel}>Samples</ThemedText>
            <ThemedText style={styles.statValue}>{history.length}</ThemedText>
          </View>
        </View>
      )}

      {history.length > 0 && (
        <Collapsible title={`FPS History (${history.length})`}>
          {history.map((snap) => (
            <View key={snap.id} style={styles.historyRow}>
              <ThemedText style={styles.historyTime}>{snap.timestamp}</ThemedText>
              <ThemedText style={[styles.historyFps, snap.fps < 30 && { color: '#dc3232' }]}>
                {snap.fps} FPS
              </ThemedText>
            </View>
          ))}
        </Collapsible>
      )}

      <ThemedText style={styles.note}>
        Measures actual frame rate using Reanimated's useFrameCallback. The monitor counts frames
        rendered per second on the UI thread. Scroll the jank simulator below while monitoring to
        see FPS drops.
      </ThemedText>
    </View>
  );
};

const JankSimulator = () => {
  const [jankLevel, setJankLevel] = useState<'none' | 'mild' | 'heavy'>('none');
  const translateX = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    cancelAnimation(translateX);
    if (jankLevel !== 'none') {
      translateX.value = withRepeat(
        withSequence(
          withTiming(150, { duration: 500 }),
          withTiming(-150, { duration: 500 }),
        ),
        -1,
        true,
      );
    } else {
      translateX.value = withTiming(0, { duration: 200 });
    }
  }, [jankLevel, translateX]);

  const renderHeavyItem = useCallback(({ item }: { item: { id: string; label: string } }) => {
    if (jankLevel === 'heavy') {
      let sum = 0;
      for (let i = 0; i < 50000; i++) {
        sum += Math.sqrt(i);
      }
    } else if (jankLevel === 'mild') {
      let sum = 0;
      for (let i = 0; i < 5000; i++) {
        sum += Math.sqrt(i);
      }
    }
    return (
      <View style={styles.listItem}>
        <ThemedText style={styles.listItemText} numberOfLines={1}>{item.label}</ThemedText>
      </View>
    );
  }, [jankLevel]);

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Jank Simulator</ThemedText>

      <ThemedText style={styles.subtitle}>Animation smoothness indicator:</ThemedText>
      <View style={styles.animTrack}>
        <Animated.View style={[styles.animBall, animStyle]} />
      </View>

      <ThemedText style={styles.subtitle}>JS thread load level:</ThemedText>
      <View style={styles.levelRow}>
        {(['none', 'mild', 'heavy'] as const).map((level) => (
          <Pressable
            key={level}
            style={[styles.levelButton, jankLevel === level && styles.levelButtonActive]}
            onPress={() => setJankLevel(level)}>
            <ThemedText style={[styles.levelText, jankLevel === level && styles.levelTextActive]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText style={styles.subtitle}>Scroll this list while monitoring FPS:</ThemedText>
      <View style={styles.listContainer}>
        <FlatList
          data={HEAVY_LIST_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderHeavyItem}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>

      <ThemedText style={styles.note}>
        "None" renders items normally. "Mild" adds light computation per item. "Heavy" adds
        expensive math per render, blocking the JS thread and causing visible frame drops. The
        Reanimated animation runs on the UI thread, so it stays smooth even under JS load.
      </ThemedText>
    </View>
  );
};

export default function FPSMonitorScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              Frame rate (FPS) is the primary metric for UI smoothness. React Native targets 60 FPS.
              Drops below 30 FPS are perceived as "jank" — stuttering or frozen UI.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              This screen monitors real FPS using Reanimated's frame callbacks and lets you simulate
              jank by adding expensive computations to list item renders.
            </ThemedText>
          </Collapsible>
        </View>

        <FPSMonitor />

        <View style={styles.divider} />

        <JankSimulator />
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
  example: { gap: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, opacity: 0.7 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(128,128,128,0.3)',
    marginVertical: 20,
  },
  gauge: { gap: 4 },
  gaugeHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  fpsValue: { fontSize: 48, fontWeight: '800', fontFamily: 'monospace' },
  fpsUnit: { fontSize: 16, opacity: 0.5 },
  fpsLabel: { fontSize: 14, fontWeight: '600', marginLeft: 'auto' },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(128,128,128,0.15)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  barMarkers: { flexDirection: 'row', justifyContent: 'space-between' },
  markerText: { fontSize: 10, opacity: 0.4 },
  button: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(10,126,164,0.2)',
  },
  stopButton: { backgroundColor: 'rgba(220,50,50,0.15)' },
  buttonText: { color: '#0a7ea4', fontWeight: '600' },
  stopButtonText: { color: '#dc3232' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    alignItems: 'center',
    gap: 2,
  },
  statLabel: { fontSize: 11, opacity: 0.5 },
  statValue: { fontSize: 18, fontWeight: '700', fontFamily: 'monospace' },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  historyTime: { fontSize: 12, opacity: 0.5 },
  historyFps: { fontSize: 12, fontWeight: '600', fontFamily: 'monospace' },
  note: { marginTop: 12, fontSize: 13, opacity: 0.9 },
  animTrack: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  animBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0a7ea4',
  },
  levelRow: { flexDirection: 'row', gap: 8 },
  levelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  levelButtonActive: { borderColor: '#0a7ea4', backgroundColor: 'rgba(10,126,164,0.15)' },
  levelText: { fontSize: 13 },
  levelTextActive: { color: '#0a7ea4', fontWeight: '600' },
  listContainer: { height: 200, borderRadius: 8, overflow: 'hidden' },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  listItemText: { fontSize: 13 },
});
