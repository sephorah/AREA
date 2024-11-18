import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/chooseAction.dart';
import 'package:mobile/pages/chooseReaction.dart';
import 'package:mobile/pages/connectService.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:mobile/widgets/rowTitle.dart';
import 'package:mobile/widgets/servicesGrid.dart';
import 'package:provider/provider.dart';

class ChooseServicePage extends StatefulWidget {
  final bool? isAction;
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const ChooseServicePage({
    super.key,
    this.isAction,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  ChooseServicePageState createState() => ChooseServicePageState();
}

class ChooseServicePageState extends State<ChooseServicePage> {
  bool isEnglish = true;
  final ApiService apiService = ApiService();
  
  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  Future<void> onServiceSelected(Service service) async {
    AreaState areaState = Provider.of<AreaState>(context, listen:false);
    if (widget.isAction == true) {
      areaState.setActionServiceSelected(service);
    } else {
      areaState.setReactionServiceSelected(service);
    }
    final isSubscribed = await apiService.isUserSubscribed(context, service.name);
    if (isSubscribed || service.name == "weather_time" || service.name == "islamic_player" || service.name == "coinFlip") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => widget.isAction == true
              ? AuthGuard(destPage: ChooseActionPage(
                  translationManager: widget.translationManager,
                  onSwitchLanguage: widget.onSwitchLanguage,
                ))
              : AuthGuard(destPage: ChooseReactionPage(
                  translationManager: widget.translationManager,
                  onSwitchLanguage: widget.onSwitchLanguage,
                )),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AuthGuard(destPage: ConnectServicePage(
            isAction: widget.isAction,
            service: service,
            translationManager: widget.translationManager,
            onSwitchLanguage: widget.onSwitchLanguage,
          )),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final areaState = Provider.of<AreaState>(context); 
    List<Service>? services;
    if (widget.isAction == true) {
      services = areaState.actionsServices;
    } else {
      services = areaState.reactionsServices;
    }
    double screenWidth = MediaQuery.of(context).size.width;
    if (services == null || services.isEmpty) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomNavBar1(
        translationManager: widget.translationManager,
        onSwitchLanguage: widget.onSwitchLanguage,
      ),
      body: Column(
        children: [
          RowTitle(
            title: widget.translationManager.getText('chooseServicePage', 'pageTitle'),
            buttonTitle: widget.translationManager.getText('chooseServicePage', 'backButton'),
            fontColor: const Color(0xFF1E3A8A),
            buttonBgdColor: const Color(0xFF1E3A8A),
          ),
          SizedBox(height: screenWidth < 600 ? 20 : 40),
          Expanded(
            child: ServicesGrid(
              services: services,
              onServiceSelected: onServiceSelected,
            ),
          ),
        ],
      ),
    );
  }
}
