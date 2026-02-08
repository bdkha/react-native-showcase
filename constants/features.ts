export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  screen: string;
  level: 'basic' | 'advanced' | 'expert';
  tags: string[];
};

export type FeatureGroup = {
  id: string;
  title: string;
  description: string;
  items: FeatureItem[];
};

export const FEATURES: FeatureGroup[] = [
  {
    id: 'performance',
    title: 'Performance & Lists',
    description: 'Rendering optimization & re-render control',
    items: [
      {
        id: 'flatlist-basic-vs-optimized',
        title: 'FlatList: Bad vs Optimized',
        description: 'Compare re-render & scroll performance',
        screen: 'FlatListOptimizationScreen',
        level: 'expert',
        tags: ['FlatList', 'memo', 'useCallback', 'performance'],
      },
      {
        id: 'flashlist-demo',
        title: 'FlashList Demo',
        description: 'High performance large list rendering',
        screen: 'FlashListScreen',
        level: 'advanced',
        tags: ['FlashList', 'performance'],
      },
      {
        id: 'rerender-tracker',
        title: 'Re-render Tracker',
        description: 'Track component re-render count',
        screen: 'ReRenderTrackerScreen',
        level: 'expert',
        tags: ['memo', 'profiling'],
      },
      {
        id: 'window-size-impact',
        title: 'WindowSize & Batch Rendering',
        description: 'Impact of windowSize & maxToRenderPerBatch',
        screen: 'WindowSizeScreen',
        level: 'advanced',
        tags: ['FlatList', 'batching'],
      },
    ],
  },
];
