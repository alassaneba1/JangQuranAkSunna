/// Application configuration and constants
class AppConfig {
  // App Information
  static const String appName = 'JangQuranAkSunna';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // API Configuration
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080', // Android emulator localhost
  );
  
  static const String websocketUrl = String.fromEnvironment(
    'WS_BASE_URL', 
    defaultValue: 'ws://10.0.2.2:8080/ws',
  );
  
  // Authentication
  static const String googleClientId = String.fromEnvironment('GOOGLE_CLIENT_ID');
  
  // Storage
  static const String databaseName = 'jangquranaksunna.db';
  static const int databaseVersion = 1;
  static const String preferencesPrefix = 'jqs_';
  
  // Content Limits
  static const int maxDownloads = 50;
  static const int maxOfflineDays = 90;
  static const int maxFileSize = 500 * 1024 * 1024; // 500MB
  
  // Network
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const int maxRetries = 3;
  
  // Audio/Video
  static const int audioBufferSize = 32 * 1024; // 32KB
  static const double defaultPlaybackSpeed = 1.0;
  static const List<double> playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  // Cache
  static const Duration cacheMaxAge = Duration(days: 7);
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  static const int maxCacheObjects = 1000;
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // UI
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration debounceDelay = Duration(milliseconds: 500);
  static const double borderRadius = 12.0;
  static const double padding = 16.0;
  
  // Islamic Features
  static const double defaultPrayerNotificationMinutes = 15.0;
  static const List<String> supportedLanguages = ['fr', 'ar', 'wo', 'ff'];
  
  // Error Messages
  static const String genericErrorMessage = 'Une erreur est survenue. Veuillez réessayer.';
  static const String networkErrorMessage = 'Problème de connexion internet.';
  static const String serverErrorMessage = 'Problème serveur. Veuillez réessayer plus tard.';
  
  // Feature Flags
  static const bool enableOfflineMode = true;
  static const bool enableDonations = true;
  static const bool enablePrayerTimes = true;
  static const bool enableQibla = true;
  static const bool enableLiveStreaming = false;
  static const bool enableCrashlytics = true;
  static const bool enableAnalytics = true;
  
  // Social Media
  static const String facebookPageUrl = 'https://facebook.com/jangquranaksunna';
  static const String twitterUrl = 'https://twitter.com/jangquranaksunna';
  static const String instagramUrl = 'https://instagram.com/jangquranaksunna';
  static const String youtubeUrl = 'https://youtube.com/@jangquranaksunna';
  static const String websiteUrl = 'https://jangquranaksunna.org';
  
  // Support
  static const String supportEmail = 'support@jangquranaksunna.org';
  static const String supportPhone = '+221 77 123 45 67';
  static const String privacyPolicyUrl = 'https://jangquranaksunna.org/privacy';
  static const String termsOfServiceUrl = 'https://jangquranaksunna.org/terms';
  
  // Development
  static const bool isDebugMode = bool.fromEnvironment('DEBUG', defaultValue: false);
  static const bool enableLogging = bool.fromEnvironment('ENABLE_LOGGING', defaultValue: true);
  static const bool enableMockData = bool.fromEnvironment('ENABLE_MOCK_DATA', defaultValue: false);
}

/// Environment-specific configuration
enum Environment {
  development,
  staging,
  production,
}

class EnvironmentConfig {
  static const Environment current = Environment.values.firstWhere(
    (env) => env.name == String.fromEnvironment('ENVIRONMENT', defaultValue: 'development'),
    orElse: () => Environment.development,
  );
  
  static String get baseUrl {
    switch (current) {
      case Environment.development:
        return 'http://10.0.2.2:8080';
      case Environment.staging:
        return 'https://staging-api.jangquranaksunna.org';
      case Environment.production:
        return 'https://api.jangquranaksunna.org';
    }
  }
  
  static bool get isProduction => current == Environment.production;
  static bool get isDevelopment => current == Environment.development;
  static bool get isStaging => current == Environment.staging;
}
