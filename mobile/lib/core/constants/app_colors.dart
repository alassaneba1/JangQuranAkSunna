import 'package:flutter/material.dart';

/// Application color palette
class AppColors {
  // Primary Colors - Islamic Green
  static const Color primary = Color(0xFF22C55E);
  static const Color primaryLight = Color(0xFF86EFAC);
  static const Color primaryDark = Color(0xFF15803D);
  static const Color primaryVariant = Color(0xFF16A34A);
  
  // Secondary Colors - Sky Blue
  static const Color secondary = Color(0xFF0EA5E9);
  static const Color secondaryLight = Color(0xFF7DD3FC);
  static const Color secondaryDark = Color(0xFF0369A1);
  static const Color secondaryVariant = Color(0xFF0284C7);
  
  // Accent Colors
  static const Color accent = Color(0xFFF59E0B);
  static const Color accentLight = Color(0xFFFBBF24);
  static const Color accentDark = Color(0xFFD97706);
  
  // Islamic Theme Colors
  static const Color islamic = Color(0xFF059669);
  static const Color islamicLight = Color(0xFF34D399);
  static const Color islamicDark = Color(0xFF065F46);
  
  // Arabic/Calligraphy Colors
  static const Color calligraphy = Color(0xFF1E293B);
  static const Color calligraphyLight = Color(0xFF475569);
  static const Color calligraphyDark = Color(0xFF0F172A);
  
  // Background Colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color backgroundDark = Color(0xFF121212);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceDark = Color(0xFF1E1E1E);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnSecondary = Color(0xFFFFFFFF);
  
  // Dark Theme Text Colors
  static const Color textPrimaryDark = Color(0xFFE5E7EB);
  static const Color textSecondaryDark = Color(0xFF9CA3AF);
  static const Color textTertiaryDark = Color(0xFF6B7280);
  
  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color transparent = Colors.transparent;
  
  // Gray Scale
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);
  
  // Border Colors
  static const Color border = Color(0xFFE5E7EB);
  static const Color borderDark = Color(0xFF374151);
  static const Color divider = Color(0xFFE5E7EB);
  static const Color dividerDark = Color(0xFF374151);
  
  // Shadow Colors
  static const Color shadow = Color(0x1A000000);
  static const Color shadowDark = Color(0x3A000000);
  
  // Special Colors
  static const Color card = Color(0xFFFFFFFF);
  static const Color cardDark = Color(0xFF1F2937);
  static const Color shimmer = Color(0xFFE5E7EB);
  static const Color shimmerDark = Color(0xFF374151);
  
  // Content Type Colors
  static const Color audioContent = Color(0xFF8B5CF6);
  static const Color videoContent = Color(0xFFEC4899);
  static const Color textContent = Color(0xFF06B6D4);
  static const Color pdfContent = Color(0xFFF97316);
  
  // Prayer Time Colors
  static const Color fajr = Color(0xFF1E40AF);
  static const Color dhuhr = Color(0xFFF59E0B);
  static const Color asr = Color(0xFFEF4444);
  static const Color maghrib = Color(0xFF8B5CF6);
  static const Color isha = Color(0xFF1F2937);
  
  // Ramadan Theme Colors
  static const Color ramadan = Color(0xFF7C3AED);
  static const Color ramadanLight = Color(0xFFA78BFA);
  static const Color ramadanDark = Color(0xFF5B21B6);
  
  // Hajj Theme Colors
  static const Color hajj = Color(0xFFDC2626);
  static const Color hajjLight = Color(0xFFF87171);
  static const Color hajjDark = Color(0xFF991B1B);
  
  // Gradient Colors
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [secondary, secondaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient islamicGradient = LinearGradient(
    colors: [islamic, islamicDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient ramadanGradient = LinearGradient(
    colors: [ramadan, ramadanDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient sunsetGradient = LinearGradient(
    colors: [Color(0xFFFF7E5F), Color(0xFFFEB47B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  // Status-based color methods
  static Color getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
      case 'VERIFIED':
      case 'COMPLETED':
        return success;
      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'UNDER_REVIEW':
      case 'PROCESSING':
        return warning;
      case 'DRAFT':
      case 'INACTIVE':
        return gray500;
      case 'SUSPENDED':
      case 'BANNED':
      case 'REJECTED':
      case 'FAILED':
        return error;
      case 'PRIVATE':
        return info;
      default:
        return gray500;
    }
  }
  
  // Content type color methods
  static Color getContentTypeColor(String type) {
    switch (type.toUpperCase()) {
      case 'AUDIO':
        return audioContent;
      case 'VIDEO':
        return videoContent;
      case 'TEXT':
        return textContent;
      case 'PDF':
      case 'EBOOK':
        return pdfContent;
      default:
        return gray500;
    }
  }
  
  // Prayer time color methods
  static Color getPrayerTimeColor(String prayer) {
    switch (prayer.toLowerCase()) {
      case 'fajr':
        return fajr;
      case 'dhuhr':
        return dhuhr;
      case 'asr':
        return asr;
      case 'maghrib':
        return maghrib;
      case 'isha':
        return isha;
      default:
        return primary;
    }
  }
  
  // Theme-based color methods
  static Color getThemeColor(String theme) {
    switch (theme.toLowerCase()) {
      case 'ramadan':
        return ramadan;
      case 'hajj':
        return hajj;
      case 'eid':
        return accent;
      default:
        return primary;
    }
  }
}
