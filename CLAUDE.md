# Glucoplate React Native Mobile App

## 🚨 CRITICAL DEVELOPMENT RULES

### Git & Version Control
- **NEVER commit without explicit user approval** - User will say "commit that" or similar
- **NEVER push to remote** unless explicitly requested by user
- **ALWAYS wait for user confirmation** before making commits
- When making changes, accumulate them and wait for user's commit instruction
- User may want to review, test, or modify before committing

## 🔒 CRITICAL SECURITY RULES

### NEVER COMMIT THESE FILES
Before EVERY commit, verify these files are in .gitignore:
- `android/app/google-services.json` - Firebase Android config
- `ios/GoogleService-Info.plist` - Firebase iOS config  
- `android/app/*.keystore` (except debug.keystore)
- `android/gradle.properties.local` - Signing credentials
- Any file containing API keys, passwords, or secrets

### Before Committing Checklist
1. Run `git status` and verify no sensitive files are staged
2. Run `git check-ignore <file>` to verify sensitive files are ignored
3. Review all changes for hardcoded secrets
4. NEVER commit API keys, even temporarily

## 📱 Project Overview

React Native mobile app for Glucoplate nutrition tracking platform.

### Tech Stack
- **React Native** 0.76.5 (Pure CLI, no Expo)
- **TypeScript** - Type safety
- **React Navigation** v7 - Navigation
- **Zustand + Immer** - State management  
- **TanStack Query** v5 - Server state
- **MMKV** - Fast encrypted storage
- **Firebase** - Auth, Crashlytics, Analytics

### Architecture
```
src/
├── features/        # Feature-first organization
│   ├── auth/       # Authentication
│   ├── meals/      # Meal tracking
│   └── profile/    # User profile
├── core/           # Shared utilities
├── stores/         # Global state
└── navigation/     # Navigation config
```

## 🚀 Development

### Setup
```bash
# Install dependencies
npm install
cd ios && pod install

# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios
```

### Firebase Configuration
1. Download config files from Firebase Console
2. Place `google-services.json` in `android/app/`
3. Place `GoogleService-Info.plist` in `ios/`
4. NEVER commit these files!

### Release Builds

#### Android
```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Generate AAB for Play Store
./gradlew bundleRelease
```

#### iOS
Use Xcode:
1. Select "Any iOS Device" as target
2. Product → Archive
3. Distribute App

## 🔑 Signing & Credentials

### Android
- Debug keystore: `android/app/debug.keystore` (can be committed)
- Release keystore: `android/app/glucoplate-release.keystore` (NEVER commit)
- Credentials in `android/gradle.properties.local` (NEVER commit)

### iOS  
- Managed through Xcode and Apple Developer account
- Provisioning profiles auto-managed

## 🛡️ Security Best Practices

1. **API Keys**: Use environment-specific keys with proper restrictions
2. **Storage**: Use MMKV for encrypted local storage
3. **Authentication**: Firebase Auth with backend validation
4. **Code Review**: Always audit for exposed secrets before pushing
5. **Git History**: If secrets are exposed, clean history immediately:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH_TO_FILE" \
     --prune-empty --tag-name-filter cat -- --all
   git push --force --all
   ```

## 📝 Common Tasks

### Add SHA-1 to Firebase (Android)
```bash
# Debug SHA-1
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1

# Release SHA-1  
keytool -list -v -keystore android/app/glucoplate-release.keystore -alias glucoplate | grep SHA1
```

### Update Dependencies
```bash
# Check outdated
npm outdated

# Update all
npm update

# iOS pods
cd ios && pod update
```

## 🐛 Troubleshooting

### Metro Issues
```bash
# Clear cache
npm start -- --reset-cache

# Clean build
cd android && ./gradlew clean
cd ios && xcodebuild clean
```

### Build Failures
1. Clean node_modules: `rm -rf node_modules && npm install`
2. Reset Metro cache
3. Clean platform builds
4. Check for version mismatches in package.json

## 🔗 Related Repositories

- **Main App**: `/Users/bobbyjose/Work/Glucoplate/Glucoplate`
- **iOS Native**: `/Users/bobbyjose/Work/Glucoplate/mobile/glucoplate-ios`
- **Infrastructure**: `/Users/bobbyjose/Work/Personal/Glucoplate-infra`