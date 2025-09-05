# Mobile App Monitoring Setup - Firebase First Approach

## 🔥 Firebase-First Stack (Already Using for Auth)

Since you're already using Firebase for authentication, let's maximize the Firebase suite - it's **completely FREE** for your use case and provides excellent monitoring!

## Primary Monitoring Stack

### 1. **Firebase Crashlytics** - Crash Reporting (FREE - Unlimited)
Replaces the need for paid crash reporting tools

```typescript
// src/core/monitoring/crashlytics.ts
import crashlytics from '@react-native-firebase/crashlytics';

export class CrashlyticsService {
  // Set user for crash context
  setUser(userId: string, email: string) {
    crashlytics().setUserId(userId);
    crashlytics().setAttributes({
      email,
      app_version: '1.0.0',
      environment: __DEV__ ? 'development' : 'production',
    });
  }

  // Log custom errors
  logError(error: Error, context?: Record<string, any>) {
    crashlytics().recordError(error, error.message);
    
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        crashlytics().setAttribute(key, String(value));
      });
    }
  }

  // Add breadcrumbs for debugging
  log(message: string) {
    crashlytics().log(message);
  }

  // Force a test crash (dev only)
  testCrash() {
    if (__DEV__) {
      crashlytics().crash();
    }
  }
}
```

### 2. **Firebase Analytics** - User Behavior (FREE - Unlimited)
Track user actions and app usage

```typescript
// src/core/monitoring/analytics.ts
import analytics from '@react-native-firebase/analytics';

export class AnalyticsService {
  // Track screen views
  async trackScreen(screenName: string, screenClass?: string) {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  // Track custom events
  async trackEvent(eventName: string, params?: Record<string, any>) {
    // Firebase has specific event names, use custom for others
    const firebaseEventName = this.mapToFirebaseEvent(eventName);
    await analytics().logEvent(firebaseEventName, params);
  }

  // Track meal logging (specific to your app)
  async trackMealLogged(mealData: {
    meal_type: string;
    calories: number;
    method: 'photo' | 'manual' | 'voice';
  }) {
    await analytics().logEvent('meal_logged', {
      meal_type: mealData.meal_type,
      calories: mealData.calories,
      input_method: mealData.method,
      timestamp: Date.now(),
    });
  }

  // Track user properties
  async setUserProperties(properties: Record<string, string>) {
    for (const [key, value] of Object.entries(properties)) {
      await analytics().setUserProperty(key, value);
    }
  }

  // Revenue tracking
  async trackPurchase(value: number, currency: string = 'USD') {
    await analytics().logPurchase({
      value,
      currency,
      items: [],
    });
  }

  private mapToFirebaseEvent(eventName: string): string {
    // Map custom events to Firebase predefined events when possible
    const eventMap: Record<string, string> = {
      'user_signup': 'sign_up',
      'user_login': 'login',
      'recipe_share': 'share',
      'recipe_search': 'search',
      'tutorial_start': 'tutorial_begin',
      'tutorial_complete': 'tutorial_complete',
    };
    
    return eventMap[eventName] || eventName;
  }
}
```

### 3. **Firebase Performance Monitoring** - App Performance (FREE - Unlimited)
Track app startup time, network requests, and custom traces

```typescript
// src/core/monitoring/performance.ts
import perf from '@react-native-firebase/perf';

export class PerformanceService {
  // Track custom operations
  async trackOperation<T>(
    traceName: string,
    operation: () => Promise<T>,
    attributes?: Record<string, string>
  ): Promise<T> {
    const trace = await perf().startTrace(traceName);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        trace.putAttribute(key, value);
      });
    }
    
    const startTime = Date.now();
    
    try {
      const result = await operation();
      trace.putMetric('duration', Date.now() - startTime);
      trace.putAttribute('success', 'true');
      return result;
    } catch (error) {
      trace.putMetric('duration', Date.now() - startTime);
      trace.putAttribute('success', 'false');
      trace.putAttribute('error', error.message);
      throw error;
    } finally {
      await trace.stop();
    }
  }

  // Track HTTP requests
  async trackHttpRequest(url: string, method: string) {
    const metric = await perf().newHttpMetric(url, method);
    
    return {
      setRequestPayloadSize: (size: number) => metric.putAttribute('request_size', String(size)),
      setResponsePayloadSize: (size: number) => metric.putAttribute('response_size', String(size)),
      setHttpResponseCode: (code: number) => metric.setHttpResponseCode(code),
      start: () => metric.start(),
      stop: () => metric.stop(),
    };
  }

  // Track app startup
  async trackAppStartup() {
    // Firebase automatically tracks app startup, but we can add custom metrics
    const trace = await perf().startTrace('custom_app_startup');
    trace.putAttribute('has_cached_data', String(await this.hasCachedData()));
    // Your initialization code
    await trace.stop();
  }

  private async hasCachedData(): Promise<boolean> {
    // Check if user has cached data
    return false; // Implement based on your cache
  }
}
```

## 🎯 Should You Add Sentry?

### Sentry's Free Tier Behavior:
- **Hard cutoff**: After 5,000 errors/month, they stop accepting new events
- **No charges**: They will NEVER charge you without upgrading
- **No data loss fear**: Safe for solo developers
- **Month resets**: Counter resets on the 1st of each month

### When to Add Sentry to Firebase:

**✅ Add Sentry if you want:**
- Detailed stack traces with source maps
- Better error grouping and deduplication  
- Advanced error context and breadcrumbs
- Error assignment and resolution workflow
- Email/Slack alerts for new errors

**❌ Skip Sentry if:**
- Firebase Crashlytics is enough for your needs
- You want to minimize dependencies
- You're not debugging complex JS errors

### Optional Sentry Integration:

```typescript
// src/core/monitoring/sentry.ts (OPTIONAL)
import * as Sentry from '@sentry/react-native';

export class SentryService {
  initialize() {
    // Only use Sentry for non-crash JS errors
    // Let Firebase handle crashes
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      enabled: !__DEV__, // Only in production
      
      // Conservative settings to stay under free limit
      tracesSampleRate: 0.1, // Only track 10% of transactions
      
      beforeSend(event) {
        // Don't send if it's a crash (let Firebase handle)
        if (event.exception?.values?.[0]?.mechanism?.type === 'onerror') {
          return null;
        }
        return event;
      },
      
      integrations: [
        new Sentry.ReactNativeTracing({
          tracingOrigins: ['localhost', 'api.glucoplate.com'],
          routingInstrumentation: new Sentry.ReactNavigationInstrumentation(
            navigation,
          ),
        }),
      ],
    });
  }
}
```

## 📊 Unified Monitoring Service

Combine all services into one clean interface:

```typescript
// src/core/monitoring/MonitoringService.ts
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
// import * as Sentry from '@sentry/react-native'; // OPTIONAL

class MonitoringService {
  private initialized = false;
  private userId?: string;

  async initialize() {
    if (this.initialized) return;
    
    // Firebase services auto-initialize with the app
    
    // Optional: Initialize Sentry if you want it
    // if (process.env.SENTRY_DSN) {
    //   Sentry.init({...});
    // }
    
    this.initialized = true;
  }

  async setUser(user: { id: string; email: string } | null) {
    if (user) {
      this.userId = user.id;
      
      // Firebase
      await analytics().setUserId(user.id);
      await crashlytics().setUserId(user.id);
      await crashlytics().setAttributes({
        email: user.email,
        last_login: new Date().toISOString(),
      });
      
      // Optional: Sentry
      // Sentry.setUser({ id: user.id, email: user.email });
    } else {
      // Logout
      await analytics().setUserId(null);
      await crashlytics().setUserId('anonymous');
      // Sentry.setUser(null);
    }
  }

  // Unified error logging
  logError(error: Error, context?: Record<string, any>) {
    // Always log to console in dev
    if (__DEV__) {
      console.error(error, context);
    }
    
    // Firebase Crashlytics for all errors
    crashlytics().recordError(error);
    
    if (context) {
      crashlytics().log(JSON.stringify(context));
    }
    
    // Optional: Send JS errors to Sentry for better debugging
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: context });
    // }
  }

  // Track events
  async trackEvent(name: string, params?: Record<string, any>) {
    await analytics().logEvent(name, params);
    
    // Add as breadcrumb for crash context
    crashlytics().log(`Event: ${name} ${JSON.stringify(params || {})}`);
  }

  // Track screens
  async trackScreen(name: string) {
    await analytics().logScreenView({
      screen_name: name,
      screen_class: name,
    });
    crashlytics().log(`Screen: ${name}`);
  }

  // Performance tracking
  async trackPerformance<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const trace = await perf().startTrace(name);
    
    try {
      const result = await operation();
      trace.putMetric('success', 1);
      return result;
    } catch (error) {
      trace.putMetric('success', 0);
      this.logError(error as Error, { operation: name });
      throw error;
    } finally {
      await trace.stop();
    }
  }
}

export default new MonitoringService();
```

## 📱 React Native Integration

### App.tsx Integration:

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import MonitoringService from './core/monitoring/MonitoringService';

function App() {
  useEffect(() => {
    // Initialize monitoring
    MonitoringService.initialize();
    
    // Track app launch
    MonitoringService.trackEvent('app_launched', {
      version: '1.0.0',
      platform: Platform.OS,
    });
  }, []);
  
  return (
    // Your app
  );
}
```

### Navigation Integration:

```typescript
// src/core/navigation/NavigationContainer.tsx
import { NavigationContainer } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

export function AppNavigationContainer({ children }) {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      {children}
    </NavigationContainer>
  );
}
```

## 📦 Installation

```bash
# Core Firebase packages
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics
npm install @react-native-firebase/perf

# Optional: Sentry (if you want advanced error tracking)
npm install @sentry/react-native

# iOS setup
cd ios && pod install

# Android: Add to android/app/build.gradle
# apply plugin: 'com.google.gms.google-services'
# apply plugin: 'com.google.firebase.crashlytics'
# apply plugin: 'com.google.firebase.firebase-perf'
```

## 📊 Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `glucoplate-ios` project
3. Add Android app:
   - Package name: `com.glucoplate.app`
   - Download `google-services.json` to `android/app/`
4. Enable these services:
   - ✅ Analytics (auto-enabled)
   - ✅ Crashlytics (Events → Crashlytics)
   - ✅ Performance (Performance → Get Started)
   - ✅ Authentication (already setup)

## 💰 Cost Analysis

### Firebase (Your Current Choice):
- **Analytics**: FREE - Unlimited events
- **Crashlytics**: FREE - Unlimited crash reports
- **Performance**: FREE - Unlimited traces
- **Authentication**: FREE - 50K monthly active users
- **Total**: **$0/month**

### Optional Sentry Addition:
- **Free Tier**: 5,000 errors/month
- **Behavior**: Hard stops at limit, no charges
- **Reset**: Monthly on the 1st
- **Total**: **$0/month**

### Comparison with Datadog:
- **Datadog Mobile RUM**: ~$150/month minimum
- **Firebase + Sentry**: $0/month
- **Savings**: $1,800/year

## 🎯 Recommendation

1. **Start with Firebase only** - It's free and covers 90% of monitoring needs
2. **Add Sentry later** if you need:
   - Better JavaScript error debugging
   - Source map support
   - Advanced error grouping
3. **Skip other paid tools** - Firebase + optional Sentry is sufficient for most apps

## Privacy & GDPR Compliance

```typescript
// src/core/monitoring/privacy.ts
export class PrivacyManager {
  async setAnalyticsEnabled(enabled: boolean) {
    await analytics().setAnalyticsCollectionEnabled(enabled);
    await crashlytics().setCrashlyticsCollectionEnabled(enabled);
    await perf().setPerformanceCollectionEnabled(enabled);
    
    // Store preference
    storage.set('analytics_enabled', enabled);
  }
  
  async checkConsent(): Promise<boolean> {
    return storage.getBoolean('analytics_enabled') ?? true;
  }
}
```

This Firebase-first approach gives you enterprise-grade monitoring completely FREE, leveraging your existing Firebase setup!