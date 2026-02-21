import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';

const TimingExample = () => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const { width } = useWindowDimensions();
  const halfWidth = width / 2 - 60;

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>withTiming</ThemedText>

      <View style={styles.demoArea}>
        <Animated.View style={[styles.animatedBox, animatedStyle]} />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            translateX.value = withTiming(halfWidth, { duration: 600, easing: Easing.out(Easing.cubic) });
          }}>
          <ThemedText style={styles.buttonText}>Move Right</ThemedText>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            translateX.value = withTiming(-halfWidth, { duration: 600, easing: Easing.out(Easing.cubic) });
          }}>
          <ThemedText style={styles.buttonText}>Move Left</ThemedText>
        </Pressable>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          translateX.value = withTiming(0, { duration: 300 });
        }}>
        <ThemedText style={styles.buttonText}>Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        withTiming drives a shared value to a target over a set duration. useAnimatedStyle creates a
        style object that updates on the UI thread whenever the shared value changes — no bridge
        crossing, no re-renders.
      </ThemedText>
    </View>
  );
};

const SpringExample = () => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>withSpring</ThemedText>

      <View style={styles.demoArea}>
        <View style={styles.demoRow}>
          <View style={styles.demoColumn}>
            <Animated.View style={[styles.animatedBox, boxStyle]} />
            <ThemedText style={styles.demoLabel}>Scale</ThemedText>
          </View>
          <View style={styles.demoColumn}>
            <Animated.View style={[styles.animatedBox, styles.boxAlt, bounceStyle]} />
            <ThemedText style={styles.demoLabel}>Bounce</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            scale.value = withSpring(1.6, { damping: 8, stiffness: 120 });
          }}>
          <ThemedText style={styles.buttonText}>Scale Up</ThemedText>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            translateY.value = withSpring(-80, { damping: 4, stiffness: 200 });
          }}>
          <ThemedText style={styles.buttonText}>Bounce Up</ThemedText>
        </Pressable>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          scale.value = withSpring(1);
          translateY.value = withSpring(0);
        }}>
        <ThemedText style={styles.buttonText}>Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        withSpring uses physics-based animation with damping and stiffness. Low damping creates more
        oscillation (bouncy). High stiffness makes the spring snap faster. Unlike withTiming, spring
        animations have no fixed duration — they settle naturally.
      </ThemedText>
    </View>
  );
};

const CombinedExample = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [0, 360]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.3, 1]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['#0a7ea4', '#a40a7e', '#7ea40a'],
    );

    return {
      transform: [{ rotate: `${rotation}deg` }, { scale }],
      backgroundColor,
    };
  });

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Interpolation</ThemedText>

      <View style={styles.demoArea}>
        <Animated.View style={[styles.animatedBox, animatedStyle]} />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            progress.value = withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.cubic) });
          }}>
          <ThemedText style={styles.buttonText}>Animate</ThemedText>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            progress.value = withSpring(0, { damping: 12 });
          }}>
          <ThemedText style={styles.buttonText}>Spring Back</ThemedText>
        </Pressable>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          progress.value = withTiming(0, { duration: 300 });
        }}>
        <ThemedText style={styles.buttonText}>Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        interpolate maps a shared value range to output ranges — here a single progress value (0→1)
        drives rotation, scale, and color simultaneously. interpolateColor handles smooth color
        transitions. One shared value can power many animated properties.
      </ThemedText>
    </View>
  );
};

export default function ReanimatedBasicScreen() {
  const [mode, setMode] = useState<'timing' | 'spring' | 'combined'>('timing');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              React Native Reanimated runs animations on the UI thread, avoiding the JS bridge
              entirely. Shared values are the core primitive — they hold animated state accessible
              from both JS and UI threads.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              withTiming provides duration-based animation, withSpring uses physics simulation, and
              interpolate maps values across ranges to drive complex multi-property animations.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'timing' && styles.tabActive]}
            onPress={() => setMode('timing')}>
            <ThemedText style={mode === 'timing' && styles.tabTextActive}>Timing</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'spring' && styles.tabActive]}
            onPress={() => setMode('spring')}>
            <ThemedText style={mode === 'spring' && styles.tabTextActive}>Spring</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'combined' && styles.tabActive]}
            onPress={() => setMode('combined')}>
            <ThemedText style={mode === 'combined' && styles.tabTextActive}>Interpolate</ThemedText>
          </Pressable>
        </View>

        {mode === 'timing' && <TimingExample />}
        {mode === 'spring' && <SpringExample />}
        {mode === 'combined' && <CombinedExample />}
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
  demoArea: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    backgroundColor: 'rgba(128,128,128,0.05)',
    marginVertical: 4,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
  },
  demoColumn: {
    alignItems: 'center',
    gap: 8,
  },
  demoLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  animatedBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#0a7ea4',
  },
  boxAlt: {
    backgroundColor: '#a40a7e',
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
});
