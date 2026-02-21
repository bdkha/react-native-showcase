import React from 'react';

import FlatListOptimizationScreen from '@/screens/performance/FlatListOptimizationScreen';
import FlashListScreen from '@/screens/performance/FlashListScreen';
import ImageCachingScreen from '@/screens/image-and-media/ImageCachingScreen';
import ImageGridScreen from '@/screens/image-and-media/ImageGridScreen';
import VideoPlayerScreen from '@/screens/image-and-media/VideoPlayerScreen';
import ReRenderTrackerScreen from '@/screens/performance/ReRenderTrackerScreen';
import WindowSizeScreen from '@/screens/performance/WindowSizeScreen';
import ReactHookFormScreen from '@/screens/forms/ReactHookFormScreen';
import KeyboardHandlingScreen from '@/screens/forms/KeyboardHandlingScreen';
import ContextVsZustandScreen from '@/screens/state/ContextVsZustandScreen';
import ReduxToolkitScreen from '@/screens/state/ReduxToolkitScreen';
import PersistStateScreen from '@/screens/state/PersistStateScreen';
import ReanimatedBasicScreen from '@/screens/animation/ReanimatedBasicScreen';
import GestureHandlerScreen from '@/screens/animation/GestureHandlerScreen';
import RestApiScreen from '@/screens/networking/RestApiScreen';
import PaginationScreen from '@/screens/networking/PaginationScreen';
import RetryTimeoutScreen from '@/screens/networking/RetryTimeoutScreen';
import AsyncStorageScreen from '@/screens/storage/AsyncStorageScreen';
// import MMKVScreen from '@/screens/storage/MMKVScreen';
import SQLiteScreen from '@/screens/storage/SQLiteScreen';

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
  KeyboardHandlingScreen,
  ContextVsZustandScreen,
  ReduxToolkitScreen,
  PersistStateScreen,
  ReanimatedBasicScreen,
  GestureHandlerScreen,
  RestApiScreen,
  PaginationScreen,
  RetryTimeoutScreen,
  AsyncStorageScreen,
  // MMKVScreen,
  SQLiteScreen,
};
