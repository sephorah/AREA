import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/pages/allApplets.dart';
import 'package:mobile/pages/createAction.dart';
import 'package:mobile/pages/home.dart';
import 'package:mobile/pages/landingPage.dart';
import 'package:mobile/pages/login.dart';
import 'package:mobile/pages/profile.dart';
import 'package:mobile/pages/signup.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/provider/serverState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AreaState()),
        ChangeNotifierProvider(create: (_) => ServerState()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});
  
  @override
  MyAppState createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  final TranslationManager translationManager = TranslationManager();
  String crtLang = 'en';

  Future<void> loadLang(String langCode) async {
    await translationManager.loadLang(langCode);
    setState(() {});
  }
  
  void switchLang(String langCode) {
    loadLang(langCode);
    setState(() {
      crtLang = langCode;
    });
  }

  @override
  void initState() {
    super.initState();
    loadLang(crtLang);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "AREA mobile app",
      home: LandingPage(
        translationManager: translationManager,
        onSwitchLanguage: switchLang,
      ),
      debugShowCheckedModeBanner: false,
       routes: {
        '/signup': (context) => SignupPage(translationManager: translationManager, onSwitchLanguage: switchLang),
        '/login' : (context) => LoginPage(translationManager: translationManager, onSwitchLanguage: switchLang),
        '/landingPage' : (context) => LandingPage(translationManager: translationManager, onSwitchLanguage: switchLang),
        '/home' : (context) => AuthGuard(destPage: HomePage(translationManager: translationManager, onSwitchLanguage: switchLang)),
        '/profile' : (context) => AuthGuard(destPage: ProfilePage(translationManager: translationManager, onSwitchLanguage: switchLang)),
        '/createAction' : (context) => AuthGuard(destPage: CreateActionPage(translationManager: translationManager, onSwitchLanguage: switchLang)),
        '/allApplets' : (context) => AuthGuard(destPage: AllAppletsPage(translationManager: translationManager, onSwitchLanguage: switchLang)),
      },
    );
  }


}
