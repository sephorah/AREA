import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/provider/serverState.dart';
import 'package:provider/provider.dart';


class ApiService {

  final String baseUrl = 'http://10.0.2.2:8080';
  //final String baseUrl = 'http://localhost:8080';
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();
  
  String getBaseUrl(BuildContext context) {
    final serverProvider = Provider.of<ServerState>(context, listen: false);
    return serverProvider.getServerUrl();
  }

  Future<http.Response> login(BuildContext context, String username, String password) async {
    print("START =>Login Request");
    final url = Uri.parse('${getBaseUrl(context)}/login');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    if (response.statusCode == 201) {
      print("SUCCESS LOGIN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);

    }
    return response;
  }

  Future <String?> getAccessToken() async {
    return await secureStorage.read(key: 'accessToken');
  }

  Future<String?> getUserId() async {
    return await secureStorage.read(key: 'userId');
  }

  Future<void> logout(BuildContext context) async {
    print("START LOGOUT");
    final url = Uri.parse('${getBaseUrl(context)}/logout');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS LOGOUT");
      await secureStorage.delete(key: 'accessToken');
      await secureStorage.delete(key: 'userId');
      AreaState().deleteAllStates();
    }
  }

  Future<http.Response> signup(BuildContext context, String username, String email, String password, String confirmPassword) async {
    print("START SIGNUP REQUEST");
    final url = Uri.parse('${getBaseUrl(context)}/register');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'confirmPassword': confirmPassword,
      }),
    );
    if (response.statusCode == 201) {
      print("SUCCESS SIGNUP");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);
    }
    return response;
  }

  Future<String?> getGoogleAuthLink(BuildContext context) async {
    print("START GOOGLE LOGIN: GET AUTH LINK");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/provider/google');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS get Google auth link");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Google Authentification URL.');
    }
  }

  Future<String?> getSpotifyAuthLink(BuildContext context) async {
    print("START => GET SPOTIFY AUTH URL");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/provider/spotify');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => get Spotify auth URL");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Spotify Authentification URL.');
    }
  }

  Future<String?> getDiscordAuthLink(BuildContext context) async {
    print("START => get DISCORD Auth URL");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/provider/discord');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => get Discord auth url");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Discord Authentification URL.');
    }
  }

  Future<String?> getGithubAuthLink(BuildContext context) async {
    print("START => Github Auth Link");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/provider/github');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => get GITHUB AUTH LINK");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Github Authentification URL.');
    }
  }

  Future<String?> getNotionAuthLink(BuildContext context) async {
    print("START => GET NOTION AUTH LINK");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/subscribe/notion');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET NOTION AUTH LINK");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Notion Authentification URL.');
    }
  }

  Future<String?> getRedditAuthLink(BuildContext context) async {
    print("START => GET REDDIT AUTH LINK");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/subscribe/reddit');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET Reddit AUTH LINK");
      final responseData = jsonDecode(response.body);
      return responseData['url'];
    } else {
      throw Exception('Error: Failed to get Reddit Authentification URL.');
    }
  }

  Future<http.Response> getRedditAccessToken(BuildContext context, String authCode) async {
    print("START => GET REDDIT ACCESS TOKEN");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/reddit/accessToken?code=$authCode');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET REDDIT ACCESS TOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    } 
    return response;
  }

  Future<http.Response> getNotionAccessToken(BuildContext context, String authCode) async {
    print("START => GET NOTION ACCESS TOKEN");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/notion/accessToken?code=$authCode');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET NOTION ACCESS TOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    } 
    return response;
  }

  Future<http.Response> getGoogleAccessTokenUserId(BuildContext context, String authCode) async {
    print("START => GET GOOGLE ACCESS TOKEN & USERID");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/login/google?code=$authCode');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET GOOGLE ACCESS TOKEN & USERID");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);
    } else {
      throw Exception('Failed to exchange authorization code for access token & userId.');
    } 
    return response;
  }

  Future<http.Response> getGoogleAccessToken(BuildContext context, String authCode) async {
    print("START => GET GOOGLE ACCESS TOKEN");

    final url = Uri.parse('${getBaseUrl(context)}/oauth2/google/accessToken?code=$authCode');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET GOOGLE ACCESS TOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    } 
    return response;
  }

  Future<http.Response> getSpotifyAccessTokenUserId(BuildContext context, String code) async {
    print("START => GET SPOTIFY ACCESS TOKEN and USERID");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/login/spotify?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET SPOTIFY ACCESS TOKEN and USERID");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);
    } else {
      print("FAILED GET ACCESS TOKEN");
      throw Exception('Failed to exchange authorization code for access token & userId.');
    }
    return response;
  }

  Future<http.Response> getSpotifyAccessToken(BuildContext context, String code) async {
    print("START => GET SPOTIFY ACCESS TOKEN");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/spotify/accessToken?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET SPOTIFY ACCESS TOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    }
    return response;
  }

  Future<http.Response> getGithubAccessTokenUserId(BuildContext context, String code) async {
    print("START => GET GITHUB ACCESSTOKEN & USERID");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/login/github?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET GITHUB ACCESSTOKEN & USERID");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);
    } else {
      throw Exception('Failed to exchange authorization code for access token & userId.');
    }
    return response;
  }

  Future<http.Response> getGithubAccessToken(BuildContext context, String code) async {
    print("START => GET GITHUB ACCESSTOKEN");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/github/accessToken?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET GITHUB ACCESSTOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    }
    return response;
  }

  Future<http.Response> getDiscordAccessTokenUserId(BuildContext context, String code) async {
    print("START => GET DISCORD ACCESSTOKEN AND USERID");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/login/discord?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET DISCORD ACCESSTOKEN & USERID");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      final String userId = responseData['userId'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'userId', value: userId);
    } else {
      throw Exception('Failed to exchange authorization code for access token & userId.');
    }
    return response;
  }

  Future<http.Response> getDiscordAccessToken(BuildContext context, String code) async {
    print("START => GET DISCORD ACCESSTOKEN");
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/discord/accessToken?code=$code');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      print("SUCCESS => GET DISCORD ACCESSTOKEN");
      final responseData = jsonDecode(response.body);
      final String accessToken = responseData['accessToken'];
      await secureStorage.write(key: 'accessToken', value: accessToken);
    } else {
      throw Exception('Failed to exchange authorization code for access token.');
    }
    return response;
  }

  Future<bool> isUserSubscribed(BuildContext context, String service) async {
    print('START => CHECK IS USER IS SUBSCRIBED TO $service');
    final url = Uri.parse('${getBaseUrl(context)}/oauth2/service/$service/subscribed');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      final bool isSubscribed= responseData['connected'];
      print('SUCCESS => CHECK IS USER IS SUBSCRIBED TO $service = $isSubscribed');
      return isSubscribed;
    } else {
      throw Exception('Failed to get the subscription state.');
    }
  }

  Future<List<Service>> getAllServices(BuildContext context) async {
    print("START => GET ALL SERVICES");
    List<Service> services = [];
    final url = Uri.parse('${getBaseUrl(context)}/services');
    final response = await http.get(url, headers: {'Content-Type': 'application/json'});

    if (response.statusCode == 200) {
      print("SUCCESS => GET ALL SERVICES");
      List<dynamic>? servicesJson = json.decode(response.body)['services'];
      if (servicesJson == null) {
        throw Exception('No services found');
      }
      services = servicesJson.map((serviceJson) {
        Service service = Service.fromJson(serviceJson);
        DataService dataOfService = dataServices.firstWhere(
          (DataService dataService) => dataService.key == service.name,
          orElse: () => DataService(key: '', serviceName: '', iconPath: '', color: Colors.grey),
        );
        return Service(
          name: service.name,
          actions: [],
          reactions: [],
          dataService: dataOfService
        );
      }).toList();
      
      for (Service service in services) {
        await getActionsForService(context, service);
        await getReactionsForService(context, service);
      }
    } else {
      throw Exception('Failed to get services');
    }
    return services;
  }

  Future<void> getActionsForService(BuildContext context, Service service) async {
    print("START => GET ACTIONS FOR ${service.name}");
    final url = Uri.parse('${getBaseUrl(context)}/service/${service.name}/actions');
    final response = await http.get(url, headers: {'Content-Type': 'application/json'});

    if (response.statusCode == 200) {
      print("SUCCESS => GET ACTIONS FOR ${service.name}");
      var bodyJson = json.decode(response.body);
      if (bodyJson.isEmpty) {
        print("No actions found for ${service.name} (empty response)");
        return;
      }
      if (bodyJson is Map && bodyJson.containsKey('areas') && bodyJson['areas'] != null) {
        List<dynamic> actionsJson = bodyJson['areas'];
        try {
          List<ActionReaction> actions = actionsJson.map((json) {
            return ActionReaction.fromJson(json);
          }).toList();
          service.actions.addAll(actions);
        } catch (e) {
          print("Error while mapping actions for ${service.name}: $e");
        }
      } else {
        print("No actions found for ${service.name}");
      }
    } else {
      throw Exception('Failed to get actions for service ${service.name}');
    }
  }

  Future<void> getReactionsForService(BuildContext context, Service service) async {
    print("START => GET REACTIONS FOR ${service.name}");
    final url = Uri.parse('${getBaseUrl(context)}/service/${service.name}/reactions');
    final response = await http.get(url, headers: {'Content-Type': 'application/json'});

    if (response.statusCode == 200) {
      print("SUCCESS => GET REACTIONS FOR ${service.name}");
      var bodyJson = json.decode(response.body);
      if (bodyJson.isEmpty) {
        print("No reactions found for ${service.name} (empty response)");
        return;
      }
      if (bodyJson is Map && bodyJson.containsKey('areas') && bodyJson['areas'] != null) {
        List<dynamic> reactionsJson = bodyJson['areas'];
        List<ActionReaction> reactions = reactionsJson.map((json) => ActionReaction.fromJson(json)).toList();
        service.reactions.addAll(reactions);
      } else {
        print("No reactions found for ${service.name}");
      }
    } else {
      throw Exception('Failed to get reactions for service ${service.name}');
    }
  }

  Future<List<Service>> getActionsServices(List<Service> allServices) async {
    print("GET ACTIONS SERVICES");
    List<Service> actionsServices = [];
    for (Service service in allServices) {
      if (service.actions.isNotEmpty) {
        actionsServices.add(service);
      }
    }
    return actionsServices;
  }

  Future<List<Service>> getReactionsServices(List<Service> allServices) async {
    print("GET REACTIONS SERVICES");

    List<Service> reactionsServices = [];
    for (Service service in allServices) {
      if (service.reactions.isNotEmpty) {
        reactionsServices.add(service);
      }
    }
    return reactionsServices;
  }

  Future<http.Response> sendAreaJson(BuildContext context, Map<String, dynamic> areaJson) async {
    print("START => send AREA JSON");
    print("AREA CREATED ==> ${areaJson.entries}");
    final url = Uri.parse('${getBaseUrl(context)}/create/area');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(areaJson),
    );
    if (response.statusCode != 201) {
      print("FAILED => send AREA JSON ");
      throw Exception('Failed to create AREA. Status code: ${response.statusCode}');
    }
    print("RESPONSE BODY = ${response.body}");
    return response;
  }

  Future<Map<String, dynamic>> getUserInfos(BuildContext context) async {
    String? userId = await secureStorage.read(key: "userId");
    final url = Uri.parse('${getBaseUrl(context)}/user/$userId/info');
    final response = await http.get(
      url,
      headers: {
        'Content-type': 'application/json',
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to create AREA. Status code: ${response.statusCode}');
    }
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> getUserAreas(BuildContext context) async {
    print("START => GET USER AREAS");
    String? userId = await secureStorage.read(key: "userId");
    final url = Uri.parse('${getBaseUrl(context)}/user/$userId/areas');
    final response = await http.get(
      url,
      headers: {
        'Content-type': 'application/json',
      },
    );
    if (response.statusCode != 200) {
      print("FAIL => GET USER AREAS");
      throw Exception('Failed to create AREA. Status code: ${response.statusCode}');
    }
    return jsonDecode(response.body);
  }
}

 