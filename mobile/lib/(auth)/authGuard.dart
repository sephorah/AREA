import 'package:flutter/material.dart';
import 'package:mobile/(auth)/auth.dart';

class AuthGuard extends StatelessWidget {
  final Widget destPage;
  final AuthService authService = AuthService();

  AuthGuard({super.key, required this.destPage});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: authService.isLogin(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasData && snapshot.data == true) {
          return destPage;
        } else {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.of(context).pushReplacementNamed('/login');
          });
          return const SizedBox.shrink();
        }
      },
    );
  }
}