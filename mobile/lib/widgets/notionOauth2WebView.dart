import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/(api)/api.dart';
import 'package:webview_flutter/webview_flutter.dart';

class NotionOAuthWebView extends StatefulWidget {
  final String notionUrl;

  const NotionOAuthWebView({
    super.key,
    required this.notionUrl,
  });

  @override
  NotionOAuthWebViewState createState() => NotionOAuthWebViewState();
}

class NotionOAuthWebViewState extends State<NotionOAuthWebView> {

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
        Uri.parse(widget.notionUrl),
      );
  }

  void handleUrlRedirection(String url) async {
    if (url.startsWith('http://localhost:8081/')) {
      Uri uri = Uri.parse(url);
      String? authCode = uri.queryParameters['code'];
      if (authCode != null) {
        final http.Response response = await apiService.getNotionAccessToken(context, authCode);
        if (response.statusCode == 200) {
          print("SUCCESS => HANDLLE URL REDIRECTION , Login with Notion. ");
          Navigator.of(context).pop();
        } else {
          print("FAIL => HANDLE URL REDIRECTION , Login with Notion. ");
          Navigator.of(context).pop();
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
          "Notion Authentification",
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