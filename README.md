# React Native Showcase

A demo app built with **React Native** and **Expo** that showcases practical patterns, performance techniques, and best practices for production applications. Each feature is presented as a runnable screen with side-by-side or tabbed comparisons (e.g. “bad” vs “optimized”) where relevant.

## Tech Stack

| Category | Library |
|----------|---------|
| **Framework** | React Native 0.81 · Expo SDK 54 · TypeScript 5.9 |
| **Navigation** | Expo Router 6 (file-based) |
| **Lists** | FlatList · @shopify/flash-list 2.0 |
| **Images & Video** | expo-image · expo-video |
| **Forms** | react-hook-form 7 · react-native-keyboard-controller |
| **State** | Zustand 5 · Redux Toolkit 2 · react-redux 9 |
| **Animation & Gesture** | react-native-reanimated 4 · react-native-gesture-handler 2 |
| **Networking** | Axios (shared instance with interceptors) |
| **Storage** | @react-native-async-storage · react-native-mmkv · expo-sqlite |
| **Utilities** | react-native-safe-area-context |

## Project Structure

```
app/
  (tabs)/               # Main tab (home = feature group grid)
  group/[id].tsx        # List of features in a group
  feature/[screen].tsx  # Dynamic feature demo screen
constants/
  features.ts           # Feature groups & items (metadata)
  theme.ts              # Colors, fonts
screens/
  performance/          # FlatList, FlashList, re-render, windowSize
  image-and-media/      # Image caching, grid, video player
  forms/                # React Hook Form, keyboard handling
  state/                # Context vs Zustand, Redux, persist
  animation/            # Reanimated, gesture handler
  networking/           # REST API, pagination, retry & timeout
  storage/              # AsyncStorage, MMKV, SQLite
  debug/                # Flipper, FPS monitor
  feature-registry.tsx  # Screen name → component map
lib/
  api-client.ts         # Shared Axios instance with interceptors
videos/                 # Demo video recordings (per feature)
```

The home screen shows a **grid of feature groups**. Tapping a group opens its feature list; tapping a feature opens the corresponding demo screen.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. Run the app in a simulator, emulator, or [Expo Go](https://expo.dev/go).

   - iOS simulator: press `i` in the terminal or use `npm run ios`
   - Android emulator: press `a` or use `npm run android`
   - Web: press `w` or use `npm run web`

## Feature Demos

| Category | Feature | Description | Level | Demo Video |
|----------|---------|-------------|-------|------------|
| **Performance & Lists** | FlatList: Bad vs Optimized | Compare re-render & scroll performance | Expert | [Video](./videos/flatlist-basic-vs-optimized.mp4) |
| | FlashList Demo | High performance large list rendering | Advanced | [Video](./videos/flashlist-demo.mp4) |
| | Re-render Tracker | Track component re-render count | Expert | [Video](./videos/rerender-tracker.mp4) |
| | WindowSize & Batch Rendering | Impact of windowSize & maxToRenderPerBatch | Advanced | [Video](./videos/window-size-impact.mp4) |
| **Images & Media** | Image Caching | Prevent image reload on scroll | Expert | [Video](./videos/image-caching.mp4) |
| | Image Grid | Lazy loading image grid | Advanced | [Video](./videos/image-grid.mp4) |
| | Video Player | Play, pause, buffering handling | Advanced | [Video](./videos/video-player.mp4) |
| **Forms & Validation** | React Hook Form | Validation & controlled inputs | Advanced | [Video](./videos/react-hook-form.mp4) |
| | Keyboard Handling | KeyboardAvoidingView & edge cases | Basic | [Video](./videos/keyboard-handling.mp4) |
| **State Management** | Context vs Zustand | Re-render comparison | Expert | [Video](./videos/context-vs-zustand.mp4) |
| | Redux Toolkit | Global state & async flow | Advanced | [Video](./videos/redux-toolkit.mp4) |
| | Persisted State | Persist & rehydrate app state | Advanced | [Video](./videos/persist-state.mp4) |
| **Animations & Gestures** | Reanimated Basics | Shared values & timing | Advanced | [Video](./videos/reanimated-basic.mp4) |
| | Gesture Interaction | Pan, swipe, drag gestures | Expert | [Video](./videos/gesture-handler.mp4) |
| **Networking** | REST API | Axios with interceptors | Basic | [Video](./videos/rest-api.mp4) |
| | Pagination | Infinite scroll with API | Advanced | [Video](./videos/pagination.mp4) |
| | Retry & Timeout | Network resilience handling | Expert | [Video](./videos/retry-timeout.mp4) |
| **Local Storage** | AsyncStorage | Basic key-value storage | Basic | [Video](./videos/async-storage.mp4) |
| | MMKV Storage | High performance local storage | Expert | [Video](./videos/mmkv.mp4) |
| | SQLite | Structured local database | Advanced | [Video](./videos/sqlite.mp4) |
| **Native & Platform** | Native Module | Custom Android / iOS module | Expert | [Video](./videos/native-module.mp4) |
| | Platform Specific Code | Android vs iOS behavior | Advanced | [Video](./videos/platform-specific.mp4) |
| **Debug & Optimization** | Flipper Debugging | Network & layout inspection | Advanced | [Video](./videos/flipper.mp4) |
| | FPS Monitor | Track FPS & UI jank | Expert | [Video](./videos/fps-monitor.mp4) |

> Video demo files will be added to the `videos/` directory. Links above point to relative paths within the repository.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in browser |
| `npm run lint` | Run ESLint |

## License

Private project.
