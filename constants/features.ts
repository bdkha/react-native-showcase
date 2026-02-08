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
  {
    id: 'media',
    title: 'Images & Media',
    description: 'Image, video, caching & lazy loading',
    items: [
      {
        id: 'image-caching',
        title: 'Image Caching',
        description: 'Prevent image reload on scroll',
        screen: 'ImageCachingScreen',
        level: 'expert',
        tags: ['image', 'cache', 'performance'],
      },
      {
        id: 'image-grid',
        title: 'Image Grid',
        description: 'Lazy loading image grid',
        screen: 'ImageGridScreen',
        level: 'advanced',
        tags: ['grid', 'lazy-load'],
      },
      {
        id: 'video-player',
        title: 'Video Player',
        description: 'Play, pause, buffering handling',
        screen: 'VideoPlayerScreen',
        level: 'advanced',
        tags: ['video', 'media'],
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms & Validation',
    description: 'Complex forms & keyboard handling',
    items: [
      {
        id: 'react-hook-form',
        title: 'React Hook Form',
        description: 'Validation & controlled inputs',
        screen: 'ReactHookFormScreen',
        level: 'advanced',
        tags: ['form', 'validation'],
      },
      {
        id: 'keyboard-handling',
        title: 'Keyboard Handling',
        description: 'KeyboardAvoidingView & edge cases',
        screen: 'KeyboardHandlingScreen',
        level: 'basic',
        tags: ['keyboard', 'ux'],
      },
    ],
  },
  {
    id: 'state',
    title: 'State Management',
    description: 'State patterns & performance tradeoffs',
    items: [
      {
        id: 'context-vs-zustand',
        title: 'Context vs Zustand',
        description: 'Re-render comparison',
        screen: 'ContextVsZustandScreen',
        level: 'expert',
        tags: ['state', 'performance'],
      },
      {
        id: 'redux-toolkit',
        title: 'Redux Toolkit',
        description: 'Global state & async flow',
        screen: 'ReduxToolkitScreen',
        level: 'advanced',
        tags: ['redux', 'async'],
      },
      {
        id: 'persist-state',
        title: 'Persisted State',
        description: 'Persist & rehydrate app state',
        screen: 'PersistStateScreen',
        level: 'advanced',
        tags: ['storage', 'persist'],
      },
    ],
  },
  {
    id: 'animation',
    title: 'Animations & Gestures',
    description: 'Smooth UI & interactions',
    items: [
      {
        id: 'reanimated-basic',
        title: 'Reanimated Basics',
        description: 'Shared values & timing',
        screen: 'ReanimatedBasicScreen',
        level: 'advanced',
        tags: ['reanimated'],
      },
      {
        id: 'gesture-handler',
        title: 'Gesture Interaction',
        description: 'Pan, swipe, drag gestures',
        screen: 'GestureHandlerScreen',
        level: 'expert',
        tags: ['gesture', 'interaction'],
      },
    ],
  },
  {
    id: 'network',
    title: 'Networking',
    description: 'API, pagination & error handling',
    items: [
      {
        id: 'rest-api',
        title: 'REST API',
        description: 'Axios with interceptors',
        screen: 'RestApiScreen',
        level: 'basic',
        tags: ['api', 'axios'],
      },
      {
        id: 'pagination',
        title: 'Pagination',
        description: 'Infinite scroll with API',
        screen: 'PaginationScreen',
        level: 'advanced',
        tags: ['pagination', 'list'],
      },
      {
        id: 'retry-timeout',
        title: 'Retry & Timeout',
        description: 'Network resilience handling',
        screen: 'RetryTimeoutScreen',
        level: 'expert',
        tags: ['network', 'error-handling'],
      },
    ],
  },
  {
    id: 'storage',
    title: 'Local Storage',
    description: 'Data persistence strategies',
    items: [
      {
        id: 'async-storage',
        title: 'AsyncStorage',
        description: 'Basic key-value storage',
        screen: 'AsyncStorageScreen',
        level: 'basic',
        tags: ['storage'],
      },
      {
        id: 'mmkv',
        title: 'MMKV Storage',
        description: 'High performance local storage',
        screen: 'MMKVScreen',
        level: 'expert',
        tags: ['mmkv', 'performance'],
      },
      {
        id: 'sqlite',
        title: 'SQLite',
        description: 'Structured local database',
        screen: 'SQLiteScreen',
        level: 'advanced',
        tags: ['sqlite', 'database'],
      },
    ],
  },
  {
    id: 'native',
    title: 'Native & Platform',
    description: 'Native modules & platform code',
    items: [
      {
        id: 'native-module',
        title: 'Native Module',
        description: 'Custom Android / iOS module',
        screen: 'NativeModuleScreen',
        level: 'expert',
        tags: ['native', 'bridge'],
      },
      {
        id: 'platform-specific',
        title: 'Platform Specific Code',
        description: 'Android vs iOS behavior',
        screen: 'PlatformSpecificScreen',
        level: 'advanced',
        tags: ['platform'],
      },
    ],
  },
  {
    id: 'debug',
    title: 'Debug & Optimization',
    description: 'Debugging & profiling tools',
    items: [
      {
        id: 'flipper',
        title: 'Flipper Debugging',
        description: 'Network & layout inspection',
        screen: 'FlipperScreen',
        level: 'advanced',
        tags: ['debug'],
      },
      {
        id: 'fps-monitor',
        title: 'FPS Monitor',
        description: 'Track FPS & UI jank',
        screen: 'FPSMonitorScreen',
        level: 'expert',
        tags: ['performance', 'fps'],
      },
    ],
  },
];
