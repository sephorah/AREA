import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/chooseService.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/iftttComponents.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:mobile/widgets/rowTitle.dart';
import 'package:provider/provider.dart';

class CreateReactionPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const CreateReactionPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  CreateReactionPageState createState() => CreateReactionPageState();
}

class CreateReactionPageState extends State<CreateReactionPage> {
  bool isEnglish = true;
  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void onAddButtonPressed() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChooseServicePage(
          isAction: false,
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90.0),
        child: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
      ),
      body: Column(
        children: [
          RowTitle(
            title: widget.translationManager.getText("createReactionPage", "pageTitle"), 
            buttonTitle: widget.translationManager.getText("createReactionPage", "backButton"), 
            fontColor: const Color(0xFF1E3A8A), 
            buttonBgdColor: const Color(0xFF1E3A8A),
          ),
          SizedBox(height: screenWidth < 600 ? 60 : 120),
          ifttComp(context),
        ],
      ),
    );
  }

  Widget ifttComp(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    AreaState areaState = Provider.of<AreaState>(context);
    Service? actionService = areaState.actionServiceSelected;
    ActionReaction? actionSelected = areaState.actionSelected;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ComplexIftttComp(
            title: widget.translationManager.getText("createReactionPage", "ifTitle"),
            iconPath: actionService!.dataService!.iconPath,
            color: actionService.dataService!.color,
            body: actionSelected!.labelEn,
          ),
          const SizedBox(height: 10.0),
          Icon(
            Icons.arrow_downward,
            color: Colors.grey,
            size: screenWidth < 600 ? 40.0 : 70.0,
          ),
          const SizedBox(height: 10.0),
          SimpleIftttComp(
            title: widget.translationManager.getText("createReactionPage", "thenTitle"),
            isButton: true,
            buttonTitle: widget.translationManager.getText("createReactionPage", "addButton"),
            color: const Color(0xFF1E3A8A),
            onPressed: onAddButtonPressed,
          ),
        ],
      ),
    );
  }
}
