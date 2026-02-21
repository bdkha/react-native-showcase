import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const PanExample = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const updateCoords = (x: number, y: number) => {
    setCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
      runOnJS(updateCoords)(translateX.value, translateY.value);
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(updateCoords)(0, 0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Pan Gesture</ThemedText>

      <View style={styles.gestureArea}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.draggableBox, animatedStyle]}>
            <ThemedText style={styles.boxLabel}>Drag me</ThemedText>
          </Animated.View>
        </GestureDetector>
      </View>

      <ThemedText style={styles.coordText}>
        x: {coords.x}, y: {coords.y}
      </ThemedText>

      <ThemedText style={styles.note}>
        Gesture.Pan() tracks finger movement via onChange. Shared values update on the UI thread for
        60fps tracking. On release, withSpring snaps the box back to center with physics-based
        animation.
      </ThemedText>
    </View>
  );
};

const SwipeExample = () => {
  const translateX = useSharedValue(0);
  const { width } = useWindowDimensions();
  const SWIPE_THRESHOLD = 800;

  const resetCard = () => {
    setTimeout(() => {
      translateX.value = withTiming(0, { duration: 300 });
    }, 400);
  };

  const swipeGesture = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
    })
    .onEnd((e) => {
      if (Math.abs(e.velocityX) > SWIPE_THRESHOLD) {
        const direction = e.velocityX > 0 ? 1 : -1;
        translateX.value = withTiming(direction * width, { duration: 200 });
        runOnJS(resetCard)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(translateX.value, [-width / 2, 0, width / 2], [-15, 0, 15]);
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width / 2],
      [1, 0.5],
    );
    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotation}deg` }],
      opacity,
    };
  });

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Swipe Gesture</ThemedText>

      <View style={styles.gestureArea}>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.swipeCard, cardStyle]}>
            <ThemedText style={styles.cardTitle}>Swipeable Card</ThemedText>
            <ThemedText style={styles.cardSubtitle}>Swipe left or right</ThemedText>
          </Animated.View>
        </GestureDetector>
      </View>

      <ThemedText style={styles.note}>
        Swipe detection uses velocity from onEnd. If velocity exceeds the threshold, the card flies
        off-screen. Otherwise it springs back. interpolate adds tilt rotation proportional to
        horizontal translation for a natural feel.
      </ThemedText>
    </View>
  );
};

const PinchExample = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, rotationGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}rad` }],
  }));

  const handleReset = () => {
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
  };

  return (
    <View style={styles.example}>
      <ThemedText style={styles.title}>Pinch & Rotate</ThemedText>

      <View style={styles.gestureArea}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.pinchBox, animatedStyle]}>
            <ThemedText style={styles.boxLabel}>Pinch & Rotate</ThemedText>
          </Animated.View>
        </GestureDetector>
      </View>

      <Pressable style={styles.button} onPress={handleReset}>
        <ThemedText style={styles.buttonText}>Reset</ThemedText>
      </Pressable>

      <ThemedText style={styles.note}>
        Gesture.Simultaneous() composes pinch and rotation so both can be recognized at once.
        savedScale/savedRotation preserve the transform between gestures so each new interaction
        starts from the previous result, not from the initial state.
      </ThemedText>
    </View>
  );
};

export default function GestureHandlerScreen() {
  const [mode, setMode] = useState<'pan' | 'swipe' | 'pinch'>('pan');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteContainer}>
          <Collapsible title="About this demo">
            <ThemedText style={styles.noteParagraph}>
              React Native Gesture Handler provides a declarative API for recognizing gestures. When
              combined with Reanimated, gesture callbacks run on the UI thread as worklets for
              zero-lag interaction.
            </ThemedText>
            <ThemedText style={styles.noteParagraph}>
              Pan tracks finger movement, swipe uses velocity for directional detection, and pinch +
              rotation can be composed with Gesture.Simultaneous() for multi-touch transforms.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'pan' && styles.tabActive]}
            onPress={() => setMode('pan')}>
            <ThemedText style={mode === 'pan' && styles.tabTextActive}>Pan</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'swipe' && styles.tabActive]}
            onPress={() => setMode('swipe')}>
            <ThemedText style={mode === 'swipe' && styles.tabTextActive}>Swipe</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'pinch' && styles.tabActive]}
            onPress={() => setMode('pinch')}>
            <ThemedText style={mode === 'pinch' && styles.tabTextActive}>Pinch</ThemedText>
          </Pressable>
        </View>

        {mode === 'pan' && <PanExample />}
        {mode === 'swipe' && <SwipeExample />}
        {mode === 'pinch' && <PinchExample />}
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
  gestureArea: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    backgroundColor: 'rgba(128,128,128,0.05)',
    marginVertical: 4,
    overflow: 'hidden',
  },
  draggableBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  coordText: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.6,
  },
  swipeCard: {
    width: 220,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  pinchBox: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#a40a7e',
    justifyContent: 'center',
    alignItems: 'center',
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
