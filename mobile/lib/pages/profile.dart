import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/navBar2.dart';
import 'package:mobile/widgets/profileCard.dart';

class ProfilePage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const ProfilePage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  ProfilePageState createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  bool isEnglish = true;
  final ApiService apiService = ApiService();
  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    initialiazeUserInfos();
  }

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  Future<void> initialiazeUserInfos() async {
    try {
      Map<String, dynamic> userInfos = await apiService.getUserInfos(context);
      setState(() {
        usernameController.text = userInfos['username'] ?? 'Unknown';
        emailController.text = userInfos['email'] ?? 'Unknown';
        passwordController.text = userInfos['password'] ?? 'Hidden';
      });
    } catch (error) {
      print('Failed to load user information: $error');
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomNavBar2(
        translationManager: widget.translationManager,
        onSwitchLanguage: widget.onSwitchLanguage,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            Text(
              widget.translationManager.getText("profilePage", "title"),
              style: TextStyle(
                fontSize: screenWidth < 600 ? 46 : 60,
                fontFamily: "Murecho",
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1E3A8A),
              ),
            ),
            ProfileCard(
              usernameController: usernameController,
              emailController: emailController,
              passwordController: passwordController,
              translationManager: widget.translationManager,
              onSwitchLanguage: widget.onSwitchLanguage,
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
