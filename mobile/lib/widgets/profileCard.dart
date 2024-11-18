import 'package:flutter/material.dart';
import 'package:mobile/translation/translationManager.dart';

class ProfileCard extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  final TextEditingController usernameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;

  const ProfileCard({
    super.key,
    required this.usernameController,
    required this.emailController,
    required this.passwordController,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  ProfileCardState createState() => ProfileCardState();
}

class ProfileCardState extends State<ProfileCard> {
  bool isEditing = false;
  bool isVisible = true;

  void setPasswordVisibility() {
    setState(() {
      isVisible = !isVisible;
    });
  }

  void toggleEditMode() {
    setState(() {
      isEditing = !isEditing;
    });
  }

  void submitModif() {
    print("SUBMIT Modif");
    print('Username: ${widget.usernameController.text}');
    print('Email: ${widget.emailController.text}');
    print('Password: ${widget.passwordController.text}');
    setState(() {
      isEditing = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        double cardWidth = constraints.maxWidth < 600 ? constraints.maxWidth * 0.9 : 400;

        return Center(
          child: Card(
            elevation: 1,
            color: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            child: Container(
              width: cardWidth,
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: toggleEditMode,
                    icon: Icon(
                      isEditing ? Icons.cancel : Icons.edit,
                      size: 24,
                    ),
                    label: Text(
                      isEditing ? 'Cancel' : 'Edit',
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                        fontFamily: 'Murecho',
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 18.0),
                      foregroundColor: Colors.white,
                      backgroundColor: const Color(0xFF1E3A8A),
                      elevation: 5,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25)
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  IconButton(
                    icon: ClipOval(
                      child: Image.asset(
                        'assets/icons/avatar.png',
                        width: 100,
                        height: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                    onPressed: () {},
                  ),
                  const SizedBox(height: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      isEditing
                          ? buildEditingTextField("Username", widget.usernameController)
                          : buildStaticText("Username", widget.usernameController.text, cardWidth),
                      const SizedBox(height: 20),
                      isEditing
                          ? buildEditingTextField("Email", widget.emailController)
                          : buildStaticText("Email", widget.emailController.text, cardWidth),
                      const SizedBox(height: 20),
                      isEditing
                          ? buildEditingTextField("Password", widget.passwordController, isPassword: true)
                          : buildStaticText("Password", widget.passwordController.text, cardWidth),
                      const SizedBox(height: 20),
                    ],
                  ),
                  if (isEditing)
                    ElevatedButton(
                      onPressed: submitModif,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 18.0),
                        foregroundColor: Colors.white,
                        backgroundColor: const Color(0xFF1E3A8A),
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                      ),
                      child: const Text(
                        "Submit",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontFamily: 'Murecho',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget buildStaticText(String label, String value, double cardWidth) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            color: Colors.grey,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: cardWidth,
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            label == "Password" ? '•' * value.length : value,
            style: const TextStyle(
              fontSize: 18,
              fontFamily: 'Murecho',
              fontWeight: FontWeight.normal,
            ),
          ),
        ),
      ],
    );
  }

  Widget buildEditingTextField(String label, TextEditingController controller, {bool isPassword = false}) {
    return TextField(
      controller: controller,
      obscureText: isPassword && isVisible,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(
          fontSize: 18,
          fontFamily: 'Murecho',
          fontWeight: FontWeight.bold,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(isVisible ? Icons.visibility_off : Icons.visibility),
                onPressed: setPasswordVisibility,
              )
            : null,
      ),
    );
  }
}
