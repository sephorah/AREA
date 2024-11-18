import 'dart:convert';

import 'package:flutter/material.dart';

class DataService {
  final String key;
  final String serviceName;
  final String iconPath;
  final Color color;
  DataService({
    required this.key,
    required this.serviceName,
    required this.iconPath,
    required this.color,
  });
}

final List<DataService> dataServices = [
    DataService(
      key: "google",
      serviceName: "Google",
      iconPath: 'assets/icons/google.png',
      color: const Color(0xFFC83C32),
    ),
    DataService(
      key: "gmail",
      serviceName: "Gmail",
      iconPath: 'assets/icons/gmail.png',
      color: const Color(0xFFF4513A),
    ),
    DataService(
      key: "spotify",
      serviceName: "Spotify",
      iconPath: 'assets/icons/spotify.png',
      color: const Color(0xFF19C855),
    ),
    DataService(
      key: "reddit",
      serviceName: "Reddit",
      iconPath: 'assets/icons/reddit.png',
      color: const Color(0xFFFF590F),
    ),
    DataService(
      key: "notion",
      serviceName: "Notion",
      iconPath: 'assets/icons/notion.png',
      color: const Color(0xFF2D2D2D),
    ),
    DataService(
      key: "weather_time",
      serviceName: "Weather/Time",
      iconPath: 'assets/icons/weatherTime.png',
      color: const Color(0xFF5A5F5A),
    ),
    DataService(
      key: "github",
      serviceName: "Github",
      iconPath: 'assets/icons/github.png',
      color: const Color(0xFF363C44),
    ),
    DataService(
      key: "discord",
      serviceName: "Discord",
      iconPath: 'assets/icons/discord.png',
      color: const Color(0xFF4C58DC),
    ),
    DataService(
      key: "islamic_prayer",
      serviceName: "Islamic Prayer",
      iconPath: 'assets/icons/islamic_prayer.png',
      color: const Color(0xFF009688),
    ),
    DataService(
      key: "coinFlip",
      serviceName: "Coin Flip",
      iconPath: 'assets/icons/coinFlip.png',
      color: const Color.fromARGB(255, 220, 172, 76),
    ),
];

class ActionReaction {
  final String name;
  final Map<String, dynamic> params;
  final String labelFr;
  final String labelEn;

  ActionReaction({required this.name, required this.params, required this.labelFr, required this.labelEn});

  factory ActionReaction.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> parsedParams = {};
    if (json['params'] != null) {
      if (json['params'] is List) {
        for (var paramName in json['params']) {
          parsedParams[paramName] = null;
        }
      } else if (json['params'] is Map) {
        parsedParams = Map<String, dynamic>.from(json['params']);
      }
    }
    return ActionReaction(
      name: json['name'],
      params: parsedParams,
      labelFr: json['frDescription'],
      labelEn: json['enDescription'],
    );
  }
  String paramstoJson() {
    return jsonEncode(params);
  }
}

class Service {
  final String name;
  final List<ActionReaction> actions;
  final List<ActionReaction> reactions;
  final DataService? dataService;

  Service({required this.name, required this.actions, required this.reactions, this.dataService});

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(name: json['name'], actions:[], reactions:[], dataService: null);
  }
}

class AREA {
  final DataService actionServiceSelected;
  final DataService reactionServiceSelected;
  final String actionStrEn;
  final String reactionStrEn;
  final String actionStrFr;
  final String reactionStrFr;

  AREA(
    { required this.actionServiceSelected,
      required this.reactionServiceSelected, 
      required this.actionStrFr, 
      required this.actionStrEn, 
      required this.reactionStrEn,
      required this.reactionStrFr
    }
  );
}
