import { Video, ResizeMode } from 'expo-av';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const SOURCE =
  'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

export default function VideoPlayerScreen() {
  const videoRef = useRef<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }
    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }
    const next = !isMuted;
    await videoRef.current.setIsMutedAsync(next);
    setIsMuted(next);
  }, [isMuted]);

  const replay = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }
    await videoRef.current.replayAsync();
    setIsPlaying(true);
  }, []);

  const handleStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) {
      setIsBuffering(false);
      return;
    }
    setIsBuffering(status.isBuffering ?? false);
  }, []);

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
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: SOURCE }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          isLooping
          onPlaybackStatusUpdate={handleStatusUpdate}
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
      {isBuffering && (
        <View style={styles.bufferBadge}>
          <ThemedText style={styles.bufferText}>Buffering...</ThemedText>
        </View>
      )}
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
  bufferBadge: {
    marginTop: 12,
    alignItems: 'center',
  },
  bufferText: {
    fontSize: 13,
  },
});

