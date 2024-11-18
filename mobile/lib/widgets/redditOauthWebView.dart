import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/(api)/api.dart';
import 'package:webview_flutter/webview_flutter.dart';

class RedditOAuthWebView extends StatefulWidget {
  final String redditUrl;

  const RedditOAuthWebView({
    super.key,
    required this.redditUrl,
  });

  @override
  RedditOAuthWebViewState createState() => RedditOAuthWebViewState();
}

class RedditOAuthWebViewState extends State<RedditOAuthWebView> {

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
        Uri.parse(widget.redditUrl),
      );
  }

  void showSuccessLoginDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Login with Reddit Successfully",
          style: TextStyle(
            color: Color(0xFF1E3A8A),
            fontFamily: 'Murecho',
            fontSize: 22,
            fontWeight: FontWeight.bold),
          ),
          actions: [
             ElevatedButton(
                onPressed:() => {
                  Navigator.pop(context),
                  Navigator.pushReplacementNamed(context, '/home')},
                child: const Text('Close',
                  style: TextStyle(
                  color: Color(0xFF1E3A8A),
                  fontFamily: 'Murecho',
                  fontSize: 22,
                  fontWeight: FontWeight.bold)
                ),
              ),
          ],
        );
      },
    );
  }

  void handleUrlRedirection(String url) async {
    if (url.startsWith('http://localhost:8081/en/oauth2/reddit')) {
      Uri uri = Uri.parse(url);
      String? authCode = uri.queryParameters['code'];
      if (authCode != null) {
        final http.Response response = await apiService.getRedditAccessToken(context, authCode);
        if (response.statusCode == 200) {
          print("SUCCESS => HANDLLE URL REDIRECTION , Login with Reddit. ");
          Navigator.of(context).pop();
        } else {
          print("FAIL => HANDLE URL REDIRECTION , Login with Reddit. ");
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
          "Reddit Authentification",
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