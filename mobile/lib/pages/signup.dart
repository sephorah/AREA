import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/translation/translationManager.dart';
import '../(api)/api.dart';

class SignupPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const SignupPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  SignupPageState createState() => SignupPageState();
}

class SignupPageState extends State<SignupPage> {
  bool isEnglish = true;
  bool isVisible = true;
  bool isLoading = false;
  String? errorMessage;

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  final ApiService apiService = ApiService();

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void setPasswordVisibility() {
    setState(() {
      isVisible = !isVisible;
    });
  }

  void showSuccessSignupDialog(BuildContext context) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text("Sign Up Successfully",
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

  void handleSignup() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final http.Response response = await apiService.signup(
        context,
        usernameController.text,
        emailController.text,
        passwordController.text,
        confirmPasswordController.text,
      );

      if (response.statusCode == 201) {
        showSuccessSignupDialog(context);
      } else {
        setState(() {
          errorMessage = '${widget.translationManager.getText("signupPage", "signupFailed")}${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = '${widget.translationManager.getText("signupPage", "errorMessage")}$e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90.0),
        child: navBar(context),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              titleComp(),
              const SizedBox(height: 40),
              signUpFormCard(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget titleComp() {
    final screenWidth = MediaQuery.of(context).size.width;
    return Text(
      widget.translationManager.getText("signupPage", "title"),
      style: TextStyle(
        fontSize: screenWidth < 600 ? 36 : 60,
        fontWeight: FontWeight.bold,
        fontFamily: "Murecho",
        color: const Color(0xFF1E3A8A),
      ),
    );
  }

  Widget navBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      toolbarHeight: 90.0,
      automaticallyImplyLeading: false,
      title: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              'assets/app_icon.png',
              width: 45,
              height: 45,
            ),
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
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: OutlinedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/login');
            },
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF1E3A8A),
              backgroundColor: Colors.transparent,
              side: const BorderSide(color: Color(0xFF1E3A8A)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            child: Text(
              widget.translationManager.getText("signupPage", "loginButton"),
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
          padding: const EdgeInsets.only(right: 16.0),
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
      bottom: const PreferredSize(
        preferredSize: Size.fromHeight(1.0),
        child: Divider(
          height: 1,
          thickness: 1,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget signUpFormCard(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    double cardWidth = screenWidth < 600 ? screenWidth * 0.9 : 400;

    return Card(
      elevation: 2,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: cardWidth,
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            formField(
              controller: usernameController,
              labelText: widget.translationManager.getText("signupPage", "username"),
            ),
            const SizedBox(height: 20),
            formField(
              controller: emailController,
              labelText: widget.translationManager.getText("signupPage", "email"),
            ),
            const SizedBox(height: 20),
            formField(
              controller: passwordController,
              labelText: widget.translationManager.getText("signupPage", "password"),
              obscureText: isVisible,
              suffixIcon: IconButton(
                icon: Icon(isVisible ? Icons.visibility_off : Icons.visibility),
                onPressed: setPasswordVisibility,
              ),
            ),
            const SizedBox(height: 20),
            formField(
              controller: confirmPasswordController,
              labelText: widget.translationManager.getText("signupPage", "confirmPassword"),
              obscureText: isVisible,
              suffixIcon: IconButton(
                icon: Icon(isVisible ? Icons.visibility_off : Icons.visibility),
                onPressed: setPasswordVisibility,
              ),
            ),
            const SizedBox(height: 20),
            if (errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Text(
                  errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: isLoading ? null : handleSignup,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF1E3A8A)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20.0),
                  ),
                ),
                child: isLoading
                    ? const CircularProgressIndicator()
                    : Text(
                        widget.translationManager.getText("signupPage", "signupButton"),
                        style: const TextStyle(
                          fontFamily: "Murecho",
                          color: Color(0xFF1E3A8A),
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
                  Navigator.pushNamed(context, '/login');
                },
                child: Text(
                  widget.translationManager.getText("signupPage", "loginPrompt"),
                  style: const TextStyle(
                    fontFamily: "Murecho",
                    fontSize: 15,
                    color: Color(0xFF1E3A8A),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget formField({
    required TextEditingController controller,
    required String labelText,
    bool obscureText = false,
    Widget? suffixIcon,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(fontSize: 16, color: Colors.grey),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
          borderSide: const BorderSide(color: Color(0xFF1E3A8A), width: 2),
        ),
        suffixIcon: suffixIcon,
      ),
    );
  }
}
