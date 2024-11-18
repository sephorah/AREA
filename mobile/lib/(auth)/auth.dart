import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {

  final FlutterSecureStorage storage = const FlutterSecureStorage();

  Future<bool> isLogin() async {
    String? token = await storage.read(key: "accessToken");
    if (token == null) {
      return false;
    }
    return true;
  }
  Future<void> logout() async {
    await storage.delete(key:"accessToken");
  }
}