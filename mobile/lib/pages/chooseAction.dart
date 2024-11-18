import 'package:flutter/material.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/createReaction.dart';
import 'package:mobile/pages/editActionReaction.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/customBanner.dart';
import 'package:mobile/widgets/gridCards.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:provider/provider.dart';

class ChooseActionPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const ChooseActionPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  ChooseActionPageState createState() => ChooseActionPageState();
}

class ChooseActionPageState extends State<ChooseActionPage> {
  bool isEnglish = true;

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });
    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void onActionSelected(ActionReaction actionSelected) {
    final areaState = Provider.of<AreaState>(context, listen: false);
    areaState.setActionSelected(actionSelected);

    if (actionSelected.params.isEmpty) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AuthGuard(destPage: CreateReactionPage(
            translationManager: widget.translationManager,
            onSwitchLanguage: widget.onSwitchLanguage,
          )),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AuthGuard(destPage: EditActionReactionPage(
            translationManager: widget.translationManager,
            onSwitchLanguage: widget.onSwitchLanguage, isAction: true,
          )),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    final areaState = Provider.of<AreaState>(context, listen: false);
    final actionServiceSelected = areaState.actionServiceSelected;
    if (actionServiceSelected == null || actionServiceSelected.dataService == null) {
      return Scaffold(
        appBar: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
        body: const Center(
          child: Text('No service selected, please go back and select a service.'),
        ),
      );
    }
    return Scaffold(
      appBar: CustomNavBar1(
        translationManager: widget.translationManager,
        onSwitchLanguage: widget.onSwitchLanguage,
      ),
      body: Column(
        children: [
          CustomBanner(
            title: widget.translationManager.getText('chooseActionPage', 'pageTitle'),
            buttonTitle: widget.translationManager.getText('chooseActionPage', 'backButton'),
            subtitle: actionServiceSelected.dataService!.serviceName,
            iconPath: actionServiceSelected.dataService!.iconPath,
            bgdColor: actionServiceSelected.dataService!.color,
            fontColor: Colors.white,
          ),
          const SizedBox(height: 40),
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: screenWidth < 600 ? 16.0 : 40.0),
              child: GridCards(
                actionsReactions: actionServiceSelected.actions,
                color: actionServiceSelected.dataService!.color,
                onEventSelected: onActionSelected,
                translationManager: widget.translationManager,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
