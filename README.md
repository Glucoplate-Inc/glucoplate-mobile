# Glucoplate React Native Mobile App

A feature-first React Native application for nutrition tracking and meal planning, built with pure React Native (no Expo) to understand core concepts.

## 🏗 Architecture

### Tech Stack

- **React Native 0.81.1** - Pure RN without Expo abstractions
- **TypeScript** - Type safety
- **React Navigation v7** - Native stack navigation
- **Zustand + Immer** - State management with immutable updates
- **TanStack Query v5** - Server state and caching
- **MMKV** - Fast persistent storage (50x faster than AsyncStorage)
- **React Native Reanimated** - Smooth animations

### Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── screens/      # Feature screens
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Feature hooks
│   │   └── services/     # Feature services
│   ├── dashboard/
│   ├── meals/
│   └── recipes/
├── core/                  # App-wide foundation
│   ├── api/              # API client with offline support
│   ├── storage/          # MMKV storage utilities
│   ├── sync/             # Offline-first sync engine
│   ├── navigation/       # Root navigators
│   └── ui/               # Shared UI kit
├── stores/               # Zustand stores
├── hooks/                # Reusable hooks
├── utils/                # Helper functions
├── constants/            # Config + enums
├── types/                # Global TypeScript types
└── App.tsx              # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- JDK 17 (for Android)
- Android Studio with Android SDK
- Xcode 15+ (for iOS, Mac only)

### Installation

```bash
# Install dependencies
npm install

# iOS specific (Mac only)
cd ios && pod install && cd ..

# Android specific - ensure local.properties exists
cd android
echo "sdk.dir=/Users/$USER/Library/Android/sdk" > local.properties
cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## 🎯 Key Features

### Offline-First Architecture
- Full offline functionality with MMKV storage
- Sync queue for mutations when offline
- Optimistic updates with rollback
- Background sync when connection restored

### State Management
- Zustand stores with Immer for immutable updates
- Persistent storage with MMKV
- TanStack Query for server state
- DevTools integration for debugging

### Navigation
- Native stack navigation for performance
- Bottom tabs matching iOS design
- Feature-based screen organization
- Type-safe navigation with TypeScript

## 📱 Platform Specific

### Android
- Material Design components where appropriate
- Proper back button handling
- Android-specific permissions handling

### iOS
- iOS-style navigation transitions
- Native iOS components integration
- Haptic feedback support

## 🔧 Development

### Code Style
- Feature-first organization
- Separation of concerns
- Type-safe throughout
- Reusable components

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Building for Production

#### Android
```bash
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

#### iOS
```bash
cd ios
xcodebuild -workspace GlucoplateApp.xcworkspace -scheme GlucoplateApp -configuration Release
```

## 🔌 API Integration

The app connects to the Glucoplate backend:
- Local: `http://localhost:5040/api`
- Production: `https://api.glucoplate.com/api`

### Authentication Flow
1. Firebase Auth for user authentication
2. Token exchange with backend
3. Persistent session with MMKV
4. Auto-refresh on app launch

## 📝 Environment Configuration

Create `.env` file in root:
```
API_URL=http://localhost:5040/api
FIREBASE_PROJECT_ID=glucoplate-ios
```

## 🚨 Troubleshooting

### Android Build Issues
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
# Clean build folder
cd ios
xcodebuild clean
pod install --repo-update
cd ..
npm run ios
```

### Metro Bundler Issues
```bash
# Reset cache
npm start -- --reset-cache
```

## 📚 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)

## 🤝 Contributing

This is a learning project focused on understanding React Native core concepts without abstractions.

## 📄 License

MIT