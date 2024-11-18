import 'package:flutter/material.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/areaCreated.dart';
import 'package:mobile/pages/editActionReaction.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/customBanner.dart';
import 'package:mobile/widgets/gridCards.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:provider/provider.dart';

class ChooseReactionPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const ChooseReactionPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });
  @override
  ChooseReactionPageState createState() => ChooseReactionPageState();
}

class ChooseReactionPageState extends State<ChooseReactionPage> {
  bool isEnglish = true;

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });
    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void onReactionSelected(ActionReaction reactionSelected) {
    final areaState = Provider.of<AreaState>(context, listen: false);
    areaState.setReactionSelected(reactionSelected);
    if (reactionSelected.params.isEmpty) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AuthGuard(destPage: AreaCreatedPage(
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
            onSwitchLanguage: widget.onSwitchLanguage, isAction: false,
          )),
        ),
      );
    }
  }
  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    final areaState = Provider.of<AreaState>(context, listen: false);
    final reactionServiceSelected = areaState.reactionServiceSelected;
    return Scaffold(
      appBar: CustomNavBar1(
        translationManager: widget.translationManager,
        onSwitchLanguage: widget.onSwitchLanguage,
      ),
      body: Column(
        children: [
          CustomBanner(
            title: widget.translationManager.getText('chooseReactionPage', 'pageTitle'),
            buttonTitle: widget.translationManager.getText('chooseReactionPage', 'backButton'),
            subtitle: reactionServiceSelected!.dataService!.serviceName,
            iconPath: reactionServiceSelected.dataService!.iconPath,
            bgdColor: reactionServiceSelected.dataService!.color,
            fontColor: Colors.white,
          ),
          const SizedBox(height: 40),
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: screenWidth < 600 ? 16.0 : 40.0),
              child: GridCards(
                actionsReactions: reactionServiceSelected.reactions,
                color: reactionServiceSelected.dataService!.color,
                onEventSelected: onReactionSelected,
                translationManager: widget.translationManager,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
