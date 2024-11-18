import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/(api)/api.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;

class SpotifyOAuthWebView extends StatefulWidget {
  final String spotifyUrl;
  final bool isSub;

  const SpotifyOAuthWebView({
    super.key,
    required this.spotifyUrl,
    required this.isSub,
  });

  @override
  SpotifyOAuthWebViewState createState() => SpotifyOAuthWebViewState();
}

class SpotifyOAuthWebViewState extends State<SpotifyOAuthWebView> {

  late WebViewController controller;
  final ApiService apiService  = ApiService();
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState(); 

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (String url) {
          handleUrlRedirection(url);
        }
      ))
      ..setUserAgent('random')
      ..loadRequest(
        Uri.parse(widget.spotifyUrl),
      );
  }

  void handleUrlRedirection(String url) async {
    if (url.startsWith('http://localhost:8081/en/oauth2/spotify')) {
      Uri uri = Uri.parse(url);
      String? authCode = uri.queryParameters['code'];
      if (authCode != null) {
        final http.Response response;
        if (widget.isSub) {
          response = await apiService.getSpotifyAccessToken(context, authCode);
        } else {
          response = await apiService.getSpotifyAccessTokenUserId(context, authCode);
        }
        if (response.statusCode == 200) {
          print("SUCCESS => HANDLLE URL REDIRECTION , Login with Spotify. ");
          Navigator.of(context).pop();
          if (!widget.isSub) {
            Navigator.pushReplacementNamed(context, '/home');
          }
        } else {
          print("FAIL => HANDLE URL REDIRECTION , Login with Spotify. ");
          Navigator.of(context).pop();
          if (!widget.isSub) {
            Navigator.pushReplacementNamed(context, '/login');
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "Spotify Authentification",
          style: TextStyle(
            fontSize: 16,
            fontFamily: "Murecho",
            fontWeight: FontWeight.bold,
            color: Color(0xFF1E3A8A),
          ),
        ),
      ),

      body: WebViewWidget(
        controller: controller,
      ),
    );
  }
}