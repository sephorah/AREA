import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/(api)/api.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;

class GoogleOAuthWebView extends StatefulWidget {
  final String googleUrl;
  final bool isSub;

  const GoogleOAuthWebView({
    super.key,
    required this.googleUrl,
    required this.isSub,
  });

  @override
  GoogleOAuthWebViewState createState() => GoogleOAuthWebViewState();
}

class GoogleOAuthWebViewState extends State<GoogleOAuthWebView> {

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
        Uri.parse(widget.googleUrl),
      );
  }

  void handleUrlRedirection(String url) async {
    if (url.startsWith('http://localhost:8081/en/oauth2/google')) {
      Uri uri = Uri.parse(url);
      String? authCode = uri.queryParameters['code'];
      if (authCode != null) {
        final http.Response response;
        if (widget.isSub) {
          response = await apiService.getGoogleAccessToken(context, authCode);
        } else {
          response = await apiService.getGoogleAccessTokenUserId(context, authCode);
        }
        if (response.statusCode == 200) {
          print("SUCCESS => HANDLLE URL REDIRECTION , Login with Google. ");
          Navigator.of(context).pop();
          if (!widget.isSub) {
            Navigator.pushReplacementNamed(context, '/home');
          }
        } else {
          print("FAIL => HANDLE URL REDIRECTION , Login with Google. ");
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
          "Google Authentification",
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