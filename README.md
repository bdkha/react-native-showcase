# React Native Showcase

A demo app built with **React Native** and **Expo** that showcases practical patterns, performance techniques, and best practices for production applications. Each feature is presented as a runnable screen with side-by-side or tabbed comparisons (e.g. “bad” vs “optimized”) where relevant.

## Tech Stack

- **React Native** (Expo SDK 54)
- **Expo Router** – file-based navigation
- **TypeScript**
- **React Navigation** – Stack & Tabs
- **expo-image** – cached image loading
- **@shopify/flash-list** – high-performance lists
- **react-native-reanimated** – animations

## Project Structure

```
app/
  (tabs)/          # Main tab (home = feature group grid)
  group/[id].tsx    # List of features in a group
  feature/[screen].tsx  # Dynamic feature demo screen
constants/
  features.ts       # Feature groups & items (metadata)
  theme.ts          # Colors, fonts
screens/           # Feature screen components
  performance/     # FlatList, FlashList, re-render, windowSize
  feature-registry.tsx  # Screen name → component map
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

## Feature Categories

| Category | Description |
|----------|-------------|
| **Performance & Lists** | FlatList optimization, FlashList, re-render tracking, `windowSize` / `maxToRenderPerBatch` |
| **Images & Media** | Image caching (RN Image vs expo-image), lazy grids, video |
| **Forms & Validation** | React Hook Form, keyboard handling |
| **State Management** | Context vs Zustand, Redux Toolkit, persisted state |
| **Animations & Gestures** | Reanimated, gesture handler |
| **Networking** | REST API, pagination, retry & timeout |
| **Local Storage** | AsyncStorage, MMKV, SQLite |
| **Native & Platform** | Native modules, platform-specific code |
| **Debug & Optimization** | Flipper, FPS monitoring |

Screens are added incrementally; unimplemented features show a “Coming soon” state.

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
