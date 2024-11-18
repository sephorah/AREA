import 'package:flutter/material.dart';


class ServerState with ChangeNotifier {
  bool isDefaultServer = true;

  void toggleServer() {
    isDefaultServer = !isDefaultServer;
    notifyListeners();
  }
  String getServerUrl() {
    return isDefaultServer ? 'http://10.0.2.2:8080' : 'http://10.0.2.2:8082';
  }

}