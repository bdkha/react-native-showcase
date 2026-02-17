import React from 'react';

import FlatListOptimizationScreen from '@/screens/performance/FlatListOptimizationScreen';
import FlashListScreen from '@/screens/performance/FlashListScreen';
import ImageCachingScreen from '@/screens/image-and-media/ImageCachingScreen';
import ImageGridScreen from '@/screens/image-and-media/ImageGridScreen';
import VideoPlayerScreen from '@/screens/image-and-media/VideoPlayerScreen';
import ReRenderTrackerScreen from '@/screens/performance/ReRenderTrackerScreen';
import WindowSizeScreen from '@/screens/performance/WindowSizeScreen';
import ReactHookFormScreen from '@/screens/forms/ReactHookFormScreen';

export type FeatureScreenComponent = React.ComponentType;

export const FEATURE_SCREEN_REGISTRY: Record<string, FeatureScreenComponent> = {
  FlatListOptimizationScreen,
  FlashListScreen,
  ImageCachingScreen,
  ImageGridScreen,
  VideoPlayerScreen,
  ReRenderTrackerScreen,
  WindowSizeScreen,
  ReactHookFormScreen,
};
