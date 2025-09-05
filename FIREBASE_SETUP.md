# ⚠️ IMPORTANT: Firebase Configuration Security

## Security Incident Response

We've removed exposed Firebase configuration files from the repository. You need to:

### 1. Regenerate API Keys (URGENT)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `glucoplate-ios` project
3. Go to Project Settings → General
4. **Regenerate the Web API Key**
5. Add API key restrictions:
   - Application restrictions: HTTP referrers
   - API restrictions: Select specific APIs only

### 2. Download New Configuration Files

After regenerating keys:

#### For iOS:
1. Firebase Console → Project Settings → Your apps → iOS app
2. Download new `GoogleService-Info.plist`
3. Place in `ios/` directory
4. **DO NOT COMMIT TO GIT**

#### For Android:
1. Firebase Console → Project Settings → Your apps → Android app
2. Download new `google-services.json`
3. Place in `android/app/` directory  
4. **DO NOT COMMIT TO GIT**

### 3. Secure Configuration Setup

#### Option A: Environment Variables (Recommended)
```bash
# .env.local (never commit this file)
FIREBASE_API_KEY=your-new-api-key
FIREBASE_AUTH_DOMAIN=glucoplate-ios.firebaseapp.com
FIREBASE_PROJECT_ID=glucoplate-ios
FIREBASE_STORAGE_BUCKET=glucoplate-ios.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

#### Option B: Use Firebase App Check
1. Enable App Check in Firebase Console
2. This adds an additional layer of security
3. Prevents unauthorized API usage even if keys are exposed

### 4. For Team Members

Create a `firebase-config/` directory (git-ignored) with:
```
firebase-config/
├── GoogleService-Info.plist
├── google-services.json
└── README.md (with setup instructions)
```

Share these files securely via:
- 1Password/LastPass team vault
- Encrypted email
- Secure file transfer
- **NEVER via Git, Slack, or unencrypted channels**

### 5. CI/CD Setup

For automated builds:
1. Store config files as base64-encoded secrets in GitHub Actions
2. Decode during build process:

```yaml
# .github/workflows/build.yml
- name: Decode Firebase config
  env:
    GOOGLE_SERVICES_JSON: ${{ secrets.GOOGLE_SERVICES_JSON_BASE64 }}
  run: |
    echo $GOOGLE_SERVICES_JSON | base64 --decode > android/app/google-services.json
```

### 6. Additional Security Measures

1. **Enable Firebase App Check**
2. **Set up Security Rules** in Firestore/Storage
3. **Use Firebase Auth** domain restrictions
4. **Monitor usage** in Firebase Console regularly
5. **Set up alerts** for unusual activity

## Verification Checklist

- [ ] Old API key `AIzaSyA20Aglt1fhIae0qg640n8XCwLhNTKhN9c` is deactivated
- [ ] New API key is generated with restrictions
- [ ] Firebase config files are NOT in Git
- [ ] .gitignore is updated
- [ ] Team knows how to get config files securely
- [ ] CI/CD uses encrypted secrets

## Resources

- [Firebase Security Checklist](https://firebase.google.com/docs/projects/security-checklist)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

## Emergency Contacts

If keys are exposed again:
1. Immediately regenerate in Firebase Console
2. Check Firebase usage for unauthorized access
3. Review Cloud Logging for abuse
4. Contact Firebase Support if needed

---

⚠️ **Remember**: Firebase config files contain sensitive information. While some values are meant to be public (like project ID), the API keys should be protected and restricted.