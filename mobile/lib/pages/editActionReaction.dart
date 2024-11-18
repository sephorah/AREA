import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/areaCreated.dart';
import 'package:mobile/pages/createReaction.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/customBanner.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:provider/provider.dart';
import 'package:mobile/provider/areaState.dart';

class EditActionReactionPage extends StatefulWidget {
  final bool isAction;
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const EditActionReactionPage({
    super.key,
    required this.isAction,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  EditActionReactionPageState createState() => EditActionReactionPageState();
}

class EditActionReactionPageState extends State<EditActionReactionPage> {
  bool isEnglish = true;
  Map<String, TextEditingController> paramsControllers = {};

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  @override
  void initState() {
    super.initState();
    initializeControllers();
  }

  void initializeControllers() {
    final areaState = Provider.of<AreaState>(context, listen: false);
    final ActionReaction? selectedActionReaction = widget.isAction == true
        ? areaState.actionSelected 
        : areaState.reactionSelected;
    if (selectedActionReaction != null) {
      selectedActionReaction.params.forEach((paramName, paramValue) {
        paramsControllers[paramName] = TextEditingController(text:'');
      });
    }
  }

  void saveParamsToActionReaction() {
    final areaState = Provider.of<AreaState>(context, listen: false);
    final ActionReaction? selectedActionReaction = widget.isAction 
        ? areaState.actionSelected 
        : areaState.reactionSelected;

    if (selectedActionReaction != null) {
      selectedActionReaction.params.forEach((paramName, _) {
        selectedActionReaction.params[paramName] = paramsControllers[paramName]?.text ?? '';
      });
      // ignore: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member
      areaState.notifyListeners();
    }
    if (widget.isAction) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => CreateReactionPage( translationManager: widget.translationManager, onSwitchLanguage: widget.onSwitchLanguage),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AreaCreatedPage(translationManager: widget.translationManager, onSwitchLanguage: widget.onSwitchLanguage),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final areaState = Provider.of<AreaState>(context);
    final ActionReaction? selectedActionReaction = widget.isAction 
        ? areaState.actionSelected 
        : areaState.reactionSelected;
    final service = widget.isAction
        ? areaState.actionServiceSelected
        : areaState.reactionServiceSelected;
    if (selectedActionReaction == null || service == null) {
      return Scaffold(
        appBar: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
        body: const Center(
          child: Text('No action or reaction selected, please go back and select one.'),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90.0),
        child: CustomNavBar1(
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomBanner(
              title: widget.translationManager.getText('editAction', 'pageTitle'),
              buttonTitle: widget.translationManager.getText('editAction', 'backButton'),
              subtitle: service.dataService?.serviceName ?? '',
              iconPath: service.dataService?.iconPath ?? '',
              bgdColor: service.dataService?.color ?? Colors.grey,
              fontColor: Colors.white,
            ),
            const SizedBox(height: 40),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: screenWidth < 600 ? 16.0 : 40.0),
              child: Column(
                children: [
                  ...selectedActionReaction.params.keys.map((paramName) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: TextField(
                        controller: paramsControllers[paramName],
                        decoration: InputDecoration(
                          labelText: paramName,
                          border: const OutlineInputBorder(),
                        ),
                      ),
                    );
                  }),
                  ElevatedButton(
                    onPressed: saveParamsToActionReaction,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                      backgroundColor: service.dataService!.color,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(widget.translationManager.getText('editAction', 'saveButton'),
                      style: const TextStyle(
                        fontFamily: "Murecho",
                        fontSize: 20,
                        color:Colors.white, 
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    paramsControllers.forEach((_, controller) => controller.dispose());
    super.dispose();
  }
}
