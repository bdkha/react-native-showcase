import React from 'react';

import FlatListOptimizationScreen from '@/screens/performance/FlatListOptimizationScreen';
import FlashListScreen from '@/screens/performance/FlashListScreen';
import ReRenderTrackerScreen from '@/screens/performance/ReRenderTrackerScreen';
import WindowSizeScreen from '@/screens/performance/WindowSizeScreen';

export type FeatureScreenComponent = React.ComponentType;

export const FEATURE_SCREEN_REGISTRY: Record<string, FeatureScreenComponent> = {
  FlatListOptimizationScreen,
  FlashListScreen,
  ReRenderTrackerScreen,
  WindowSizeScreen,
};
