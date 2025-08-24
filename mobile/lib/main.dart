import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:audio_service/audio_service.dart';

import 'core/config/app_config.dart';
import 'core/constants/app_colors.dart';
import 'core/constants/app_themes.dart';
import 'core/routing/app_router.dart';
import 'core/services/dependency_injection.dart';
import 'core/services/database_service.dart';
import 'core/services/notification_service.dart';
import 'core/services/audio_handler.dart';
import 'core/bloc/app_bloc.dart';
import 'core/bloc/auth_bloc.dart';
import 'features/splash/presentation/pages/splash_page.dart';
import 'generated/l10n.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Setup Crashlytics
  FlutterError.onError = (errorDetails) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(errorDetails);
  };
  
  // Setup system UI
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  
  // Initialize services
  await setupDependencyInjection();
  await DatabaseService.instance.initialize();
  await NotificationService.instance.initialize();
  
  // Initialize audio service
  final audioHandler = await AudioService.init(
    builder: () => JangQuranAkSunnaAudioHandler(),
    config: const AudioServiceConfig(
      androidNotificationChannelId: 'org.jangquranaksunna.audio',
      androidNotificationChannelName: 'JangQuranAkSunna Audio',
      androidNotificationOngoing: true,
      androidShowNotificationBadge: true,
    ),
  );
  
  runApp(JangQuranAkSunnaApp(audioHandler: audioHandler));
}

class JangQuranAkSunnaApp extends StatelessWidget {
  final JangQuranAkSunnaAudioHandler audioHandler;
  
  const JangQuranAkSunnaApp({
    super.key,
    required this.audioHandler,
  });

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AppBloc>(
          create: (context) => AppBloc()..add(AppStarted()),
        ),
        BlocProvider<AuthBloc>(
          create: (context) => AuthBloc()..add(AuthCheckRequested()),
        ),
      ],
      child: BlocBuilder<AppBloc, AppState>(
        builder: (context, appState) {
          return MaterialApp.router(
            title: 'JangQuranAkSunna',
            debugShowCheckedModeBanner: false,
            
            // Routing
            routerConfig: AppRouter.router,
            
            // Localization
            locale: appState.locale,
            supportedLocales: const [
              Locale('fr', 'FR'), // Français
              Locale('ar', 'SA'), // العربية
              Locale('wo', 'SN'), // Wolof
              Locale('ff', 'SN'), // Pulaar/Fulfulde
            ],
            localizationsDelegates: const [
              S.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            
            // Theme
            theme: AppThemes.lightTheme,
            darkTheme: AppThemes.darkTheme,
            themeMode: appState.themeMode,
            
            // Builder for global providers
            builder: (context, child) {
              return MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaler: TextScaler.linear(appState.textScale),
                ),
                child: child ?? const SizedBox.shrink(),
              );
            },
          );
        },
      ),
    );
  }
}

class AppBloc extends Bloc<AppEvent, AppState> {
  AppBloc() : super(AppState.initial()) {
    on<AppStarted>(_onAppStarted);
    on<ThemeChanged>(_onThemeChanged);
    on<LocaleChanged>(_onLocaleChanged);
    on<TextScaleChanged>(_onTextScaleChanged);
  }
  
  void _onAppStarted(AppStarted event, Emitter<AppState> emit) async {
    // Load saved preferences
    // Initialize app state
    emit(state.copyWith(isInitialized: true));
  }
  
  void _onThemeChanged(ThemeChanged event, Emitter<AppState> emit) {
    emit(state.copyWith(themeMode: event.themeMode));
  }
  
  void _onLocaleChanged(LocaleChanged event, Emitter<AppState> emit) {
    emit(state.copyWith(locale: event.locale));
  }
  
  void _onTextScaleChanged(TextScaleChanged event, Emitter<AppState> emit) {
    emit(state.copyWith(textScale: event.scale));
  }
}

// App Events
abstract class AppEvent {}

class AppStarted extends AppEvent {}

class ThemeChanged extends AppEvent {
  final ThemeMode themeMode;
  ThemeChanged(this.themeMode);
}

class LocaleChanged extends AppEvent {
  final Locale locale;
  LocaleChanged(this.locale);
}

class TextScaleChanged extends AppEvent {
  final double scale;
  TextScaleChanged(this.scale);
}

// App State
class AppState {
  final bool isInitialized;
  final ThemeMode themeMode;
  final Locale locale;
  final double textScale;
  
  const AppState({
    required this.isInitialized,
    required this.themeMode,
    required this.locale,
    required this.textScale,
  });
  
  factory AppState.initial() {
    return const AppState(
      isInitialized: false,
      themeMode: ThemeMode.system,
      locale: Locale('fr', 'FR'),
      textScale: 1.0,
    );
  }
  
  AppState copyWith({
    bool? isInitialized,
    ThemeMode? themeMode,
    Locale? locale,
    double? textScale,
  }) {
    return AppState(
      isInitialized: isInitialized ?? this.isInitialized,
      themeMode: themeMode ?? this.themeMode,
      locale: locale ?? this.locale,
      textScale: textScale ?? this.textScale,
    );
  }
}

// Auth Bloc placeholder
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthState.initial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
  }
  
  void _onAuthCheckRequested(AuthCheckRequested event, Emitter<AuthState> emit) async {
    // Check if user is logged in
    // Load user data
    emit(state.copyWith(isAuthenticated: false));
  }
}

abstract class AuthEvent {}
class AuthCheckRequested extends AuthEvent {}

class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  
  const AuthState({
    required this.isAuthenticated,
    required this.isLoading,
  });
  
  factory AuthState.initial() {
    return const AuthState(
      isAuthenticated: false,
      isLoading: true,
    );
  }
  
  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}
