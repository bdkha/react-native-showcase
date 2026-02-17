import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';

const SOURCE =
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';

export default function VideoPlayerScreen() {
  const ref = useRef<VideoView>(null);
  const [isMuted, setIsMuted] = useState(false);

  const player = useVideoPlayer(SOURCE, (p) => {
    p.loop = true;
    p.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [isPlaying, player]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    player.muted = next;
    setIsMuted(next);
  }, [isMuted, player]);

  const replay = useCallback(() => {
    player.replay();
  }, [player]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteContainer}>
        <Collapsible title="About this demo">
          <ThemedText style={styles.noteParagraph}>
            This screen demonstrates a basic video player with play, pause, replay, mute, and
            buffering state.
          </ThemedText>
          <ThemedText style={styles.noteParagraph}>
            It focuses on handling media state updates and keeping UI responsive while the video is
            loading or buffering.
          </ThemedText>
        </Collapsible>
      </View>
      <View style={styles.playerWrapper}>
        <VideoView
          ref={ref}
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls={false}
        />
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={togglePlayPause}>
          <ThemedText style={styles.controlText}>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={replay}>
          <ThemedText style={styles.controlText}>Replay</ThemedText>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={toggleMute}>
          <ThemedText style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</ThemedText>
        </Pressable>
      </View>
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
  playerWrapper: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'black',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  controlText: {
    fontWeight: '600',
  },
});
