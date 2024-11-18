import 'dart:convert';
import 'package:flutter/services.dart';

class TranslationManager {
  Map<String, dynamic>? _localizedStrings;
  String? currentLanguage; 

  Future<void> loadLang(String langCode) async {
    String jsonString = await rootBundle.loadString('assets/lang/$langCode.json');
    _localizedStrings = json.decode(jsonString);
    currentLanguage = langCode;
  }

  String getText(String page, String key) {
    if (_localizedStrings == null) {
      return key;
    }
    Map<String, dynamic>? pageMap = _localizedStrings?[page];
    return pageMap?[key] ?? key;
  }
}