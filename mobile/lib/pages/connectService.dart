import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/chooseAction.dart';
import 'package:mobile/pages/chooseReaction.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/customBanner.dart';
import 'package:mobile/widgets/discordOauthWebView.dart';
import 'package:mobile/widgets/githubOauthWebView.dart';
import 'package:mobile/widgets/googleOauthWebView.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:mobile/widgets/notionOauth2WebView.dart';
import 'package:mobile/widgets/redditOauthWebView.dart';
import 'package:mobile/widgets/spotifyOauthWebView.dart';

class ConnectServicePage extends StatefulWidget {
  final Service? service;
  final bool? isAction;
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const ConnectServicePage({
    super.key,
    this.service,
    this.isAction,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  ConnectServicePageState createState() => ConnectServicePageState();
}

class ConnectServicePageState extends State<ConnectServicePage> {
  bool isEnglish = true;
  final ApiService apiService = ApiService();
  String? errorMessage;
  bool isSubscriptionComplete = false;

  @override
  void initState() {
    super.initState();
  }

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void connectToService(BuildContext context) async {
    String? authUrl;
    try {
      if (widget.service!.name == "google") {
        authUrl = await apiService.getGoogleAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => GoogleOAuthWebView(googleUrl: authUrl!, isSub: true),
            ),
          );
        }
      }
      if (widget.service!.name == "spotify") {
        authUrl = await apiService.getSpotifyAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SpotifyOAuthWebView(spotifyUrl: authUrl!, isSub: true),
            ),
          );
        }
      }
      if (widget.service!.name == "github") {
        authUrl = await apiService.getGithubAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => GithubOAuthWebView(githubUrl: authUrl!, isSub: true),
            ),
          );
        }
      }
      if (widget.service!.name == "discord") {
        authUrl = await apiService.getDiscordAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DiscordOAuthWebView(discordUrl: authUrl!, isSub: true),
            ),
          );
        }
      }
      if (widget.service!.name == "notion") {
        authUrl = await apiService.getNotionAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => NotionOAuthWebView(notionUrl: authUrl!),
            ),
          );
        }
      }
      if (widget.service!.name == "reddit") {
        authUrl = await apiService.getRedditAuthLink(context);
        if (authUrl != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RedditOAuthWebView(redditUrl: authUrl!),
            ),
          );
        }
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to Subscribe the user with web view.';
      });
    }
  }

  Future<void> onLoginSuccess(Service service) async {
    isSubscriptionComplete = await apiService.isUserSubscribed(context, service.name);
    if (isSubscriptionComplete) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => widget.isAction == true
              ? AuthGuard(destPage: ChooseActionPage(
                  translationManager: widget.translationManager,
                  onSwitchLanguage: widget.onSwitchLanguage,
                ))
              : AuthGuard(destPage: ChooseReactionPage(
                  translationManager: widget.translationManager,
                  onSwitchLanguage: widget.onSwitchLanguage,
                )),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double verticalSpacing = screenWidth < 600 ? 40.0 : 120.0;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90.0),
        child: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomBanner(
              title: widget.translationManager.getText('connectServicePage', 'pageTitle'),
              buttonTitle: widget.translationManager.getText('connectServicePage', 'backButton'),
              iconPath: widget.service!.dataService!.iconPath,
              bgdColor: widget.service!.dataService!.color,
              fontColor: Colors.white,
            ),
            SizedBox(height: verticalSpacing),
            if (errorMessage != null) Text(errorMessage!, style: const TextStyle(color: Colors.red)),
            Center(
              child: SizedBox(
                width: screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85,
                height: 80.0,
                child: ElevatedButton(
                  onPressed: () => connectToService(context),
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 15.0),
                    elevation: 5,
                    backgroundColor: widget.service!.dataService!.color,
                  ),
                  child: Text(
                    widget.translationManager.getText("connectServicePage", "buttonTitle"),
                    style: TextStyle(
                      fontSize: screenWidth > 700 ? 30 : 22,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontFamily: "Murecho",
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: verticalSpacing / 2),
            Center(
              child: SizedBox(
                width: screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85,
                height: 80.0,
                child: ElevatedButton(
                  onPressed: () => onLoginSuccess(widget.service!),
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 15.0),
                    elevation: 5,
                    backgroundColor: widget.service!.dataService!.color,
                  ),
                  child: Text(
                    widget.translationManager.getText("connectServicePage", "nextTitle"),
                    style: TextStyle(
                      fontSize: screenWidth > 700 ? 30 : 22,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontFamily: "Murecho",
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: verticalSpacing),
          ],
        ),
      ),
    );
  }
}
