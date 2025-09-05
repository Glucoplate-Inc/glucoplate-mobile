#!/bin/bash

# Generate Release Keystore for Glucoplate Android App
# This creates a production signing key for Google Play Store

echo "🔐 Generating Release Keystore for Glucoplate"
echo "============================================"
echo ""
echo "You'll be asked for the following information:"
echo "1. Keystore password (SAVE THIS - you'll need it forever!)"
echo "2. Your name and organization details"
echo "3. Key password (can be same as keystore password)"
echo ""
echo "⚠️  IMPORTANT: Store these passwords in a password manager!"
echo "⚠️  LOSING THEM = CAN'T UPDATE YOUR APP ON PLAY STORE!"
echo ""
read -p "Press Enter to continue..."

# Generate the keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore android/app/glucoplate-release.keystore \
  -alias glucoplate \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

echo ""
echo "✅ Keystore generated successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Store glucoplate-release.keystore in a SAFE place (backup it!)"
echo "2. NEVER commit this file to Git"
echo "3. Add to .gitignore: glucoplate-release.keystore"
echo "4. Save your passwords in 1Password/LastPass"
echo ""
echo "📱 Getting SHA-1 for Google Cloud Console:"
echo "Run this command with your keystore password:"
echo ""
echo "keytool -list -v -keystore android/app/glucoplate-release.keystore -alias glucoplate | grep SHA1"
echo ""

# Create gradle.properties template if it doesn't exist
if [ ! -f "android/gradle.properties" ]; then
  echo "Creating android/gradle.properties template..."
  cat > android/gradle.properties.template << 'EOF'
# Add these to your android/gradle.properties file (DO NOT COMMIT)
# Replace with your actual values

MYAPP_RELEASE_STORE_FILE=glucoplate-release.keystore
MYAPP_RELEASE_KEY_ALIAS=glucoplate
MYAPP_RELEASE_STORE_PASSWORD=YOUR_KEYSTORE_PASSWORD_HERE
MYAPP_RELEASE_KEY_PASSWORD=YOUR_KEY_PASSWORD_HERE
EOF
  echo "✅ Created android/gradle.properties.template"
  echo "Copy this to android/gradle.properties and fill in your passwords"
fi

echo ""
echo "🔐 For production builds, update android/app/build.gradle:"
echo "Add this in the android { ... } section:"
echo ""
cat << 'EOF'
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
EOF