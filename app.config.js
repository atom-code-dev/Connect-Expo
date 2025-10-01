module.exports = {
  expo: {
    name: 'Atom Connect Mobile',
    slug: 'atom-connect-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#dc2626'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.atomconnect.mobile'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#dc2626'
      },
      package: 'com.atomconnect.mobile'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      baseURL: process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000'
    },
    plugins: [
      [
        'expo-secure-store',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID for secure authentication.'
        }
      ]
    ]
  }
};