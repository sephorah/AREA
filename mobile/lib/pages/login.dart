import 'package:flutter/material.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/widgets/discordOauthWebView.dart';
import 'package:mobile/widgets/githubOauthWebView.dart';
import 'package:mobile/widgets/googleOauthWebView.dart';
import 'package:mobile/widgets/spotifyOauthWebView.dart';
import '../(api)/api.dart'; 

class LoginPage extends StatefulWidget {

  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const LoginPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  
  bool isEnglish = true;

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }
   
  bool isVisible = true;
  void setPasswordVisibility() {
    setState(() {
      isVisible = !isVisible;
    });
  }

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  bool isLoading = false;
  String? errorMessage;

  final ApiService apiService = ApiService();

  void showSuccessLoginDialog(BuildContext context) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text("Login Successfully",
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

  void handleLogin() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      final http.Response response = await apiService.login(
        context,
        usernameController.text,
        passwordController.text,
      );

      if (response.statusCode == 201) {
        // ignore: use_build_context_synchronously
        showSuccessLoginDialog(context);
      } else {
        setState(() {
          errorMessage = 'Login failed: ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }


  void handleGoogleLogin() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      final String? googleAuthUrl = await apiService.getGoogleAuthLink(context);

      if (googleAuthUrl != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => GoogleOAuthWebView(googleUrl: googleAuthUrl, isSub: false),
          ),
        );
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void handleSpotifyLogin() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final String? spotifyAuthUrl = await apiService.getSpotifyAuthLink(context);

      if (spotifyAuthUrl != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SpotifyOAuthWebView(spotifyUrl: spotifyAuthUrl, isSub: false),
          ),
        );
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void handleDiscordLogin() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final String? discordAuthUrl = await apiService.getDiscordAuthLink(context);

      if (discordAuthUrl != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DiscordOAuthWebView(discordUrl: discordAuthUrl, isSub: false),
          ),
        );
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void handleGithubLogin() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final String? githubAuthUrl = await apiService.getGithubAuthLink(context);
      if (githubAuthUrl != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => GithubOAuthWebView(githubUrl: githubAuthUrl, isSub: false),
          ),
        );
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        toolbarHeight: 90.0,
        automaticallyImplyLeading: false,
        title: Padding(
          padding: const EdgeInsets.symmetric(vertical: 0.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Image.asset(
                'assets/app_icon.png',
                width: 45,
                height: 45,
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  widget.translationManager.getText('landingPage', 'appTitle'),
                  style: const TextStyle(
                    color: Color(0xFF1E3A8A),
                    fontFamily: 'Murecho',
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 15.0),
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/signup');
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF1E3A8A),
                    backgroundColor: Colors.transparent,
                    side: const BorderSide(color: Color(0xFF1E3A8A)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                  ),
                  child: Text(
                    widget.translationManager.getText('loginPage', 'createAccount'),
                    style: const TextStyle(
                      color: Color(0xFF1E3A8A),
                      fontFamily: 'Murecho',
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 5.0),
                child: IconButton(
                  icon: ClipOval(
                    child: Image.asset(
                      isEnglish ? 'assets/icons/UK.png' : 'assets/icons/FR.png',
                      width: 25,
                      height: 25,
                      fit: BoxFit.cover,
                    ),
                  ),
                  onPressed: changeLang,
                ),
              ),
            ],
          ),
        ],
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1.0),
          child: Divider(
            height: 1,
            thickness: 1,
            color: Colors.grey,
          ),
        ),
      ),
      
      body: Center(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1000),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),
                  Text(
                    widget.translationManager.getText("loginPage", "title"),
                    style: TextStyle(
                      fontSize: screenWidth < 600 ? 46 : 60,
                      fontFamily: "Murecho",
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1E3A8A),
                    ),
                  ),
                  const SizedBox(height: 10),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      if (constraints.maxWidth > 600) {
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Expanded(child: loginFormCard(context)),
                            const SizedBox(width: 16),
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  widget.translationManager.getText("loginPage", "diviser"),
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontFamily: "Murecho",
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1E3A8A),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(width: 16),
                            Expanded(child: socialLoginCard(context)),
                          ],
                        );
                      } else {
                        return Column(
                          children: [
                            loginFormCard(context),
                            const SizedBox(height: 16),
                            Text(
                              widget.translationManager.getText("loginPage", "diviser"),
                              style: const TextStyle(
                                fontSize: 20,
                                fontFamily: "Murecho",
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E3A8A),
                              ),
                            ),
                            socialLoginCard(context),
                          ],
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget loginFormCard(BuildContext context) {
    return Card(
      elevation: 1,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: usernameController,
              decoration: InputDecoration(
                labelText: widget.translationManager.getText("loginPage", "username"),
                labelStyle: const TextStyle(fontSize: 16, color: Colors.grey, fontFamily: "Murecho"),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: const BorderSide(color: Color(0xFF1E3A8A), width: 2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              obscureText: isVisible,
              controller: passwordController,
              decoration: InputDecoration(
                labelText: widget.translationManager.getText("loginPage", "password"),
                labelStyle: const TextStyle(fontSize: 16, color: Colors.grey, fontFamily: "Murecho"),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: const BorderSide(color: Color(0xFF1E3A8A), width: 2),
                ),
                suffixIcon: IconButton(
                  icon: Icon(isVisible ? Icons.visibility_off : Icons.visibility),
                  onPressed: setPasswordVisibility,
                ),
              ),
            ),
            const SizedBox(height: 20),
            if (errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Text(
                  errorMessage!,
                  style: const TextStyle(color: Colors.red, fontFamily: "Murecho"),
                ),
              ),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: isLoading ? null : handleLogin,
                style: OutlinedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  side: const BorderSide(color: Color(0xFF1E3A8A)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                ),
                child: isLoading
                    ? const CircularProgressIndicator()
                    : Text(
                        widget.translationManager.getText("loginPage", "loginButton"),
                        style: const TextStyle(
                          fontFamily: "Murecho",
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 20),
            Align(
              alignment: Alignment.center,
              child: TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/signup');
                },
                child: Text(
                  widget.translationManager.getText("loginPage", "signupPrompt"),
                  style: const TextStyle(
                    fontFamily: "Murecho",
                    fontSize: 15,
                    color: Color(0xFF1E3A8A),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget socialLoginCard(BuildContext context) {
    return Card(
      elevation: 1,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            SocialLoginButton(
              icon: Image.asset(
                'assets/icons/google.png',
                width: 24,
                height: 24,
              ),
              label: widget.translationManager.getText("loginPage", "googlePrompt"),
              onPressed:() => {handleGoogleLogin()},
            ),
            const SizedBox(height: 10),
            SocialLoginButton(
              icon: Image.asset(
                'assets/icons/spotify.png',
                width: 30,
                height: 30,
              ),
              label: widget.translationManager.getText("loginPage", "spotifyPrompt"),
              onPressed: () { handleSpotifyLogin();},
            ),
            const SizedBox(height: 10),
            SocialLoginButton(
              icon: Image.asset(
                'assets/icons/discord.png',
                width: 24,
                height: 24,
              ),
              label: widget.translationManager.getText("loginPage", "discordPrompt"),
              onPressed: () { handleDiscordLogin();},
            ),
            const SizedBox(height: 10),
            SocialLoginButton(
              icon: Image.asset(
                'assets/icons/github.png',
                width: 24,
                height: 24,
              ),
              label: widget.translationManager.getText("loginPage", "githubPrompt"),
              onPressed: () { handleGithubLogin();},
            ),
          ],
        ),
      ),
    );
  }
}

class SocialLoginButton extends StatelessWidget {
  final Widget icon;
  final String label;
  final VoidCallback onPressed;

  const SocialLoginButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: icon,
      label: Text(
        label,
        style: const TextStyle(
          fontSize: 18,
          fontFamily: "Murecho",
          fontWeight: FontWeight.bold,
          color: Color(0xFF1E3A8A),
        ),
      ),
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(double.infinity, 50),
        backgroundColor: Colors.white,
        side: const BorderSide(color:  Color(0xFF1E3A8A)),
        elevation: 1,
      ),
    );
  }
}
