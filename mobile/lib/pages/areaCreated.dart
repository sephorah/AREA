import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/(api)/api.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/iftttComponents.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:mobile/widgets/rowTitle.dart';
import 'package:provider/provider.dart';

class AreaCreatedPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const AreaCreatedPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  AreaCreatedPageState createState() => AreaCreatedPageState();
}

class AreaCreatedPageState extends State<AreaCreatedPage> {
  
  bool isEnglish = true;
  bool isLoading = false;
  String? errorMessage;
  final apiService = ApiService();

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });
    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  Future<Map<String, dynamic>> areaToJson() async {
    final areaState = Provider.of<AreaState>(context, listen: false);
    ActionReaction? actionSelected = areaState.actionSelected;
    ActionReaction? reactionSelected = areaState.reactionSelected;
    String? ownerId = await ApiService().getUserId();
    if (actionSelected == null || reactionSelected == null) {
      throw Exception('Incomplete data');
    }
    Map<String, dynamic> areaJson = {
      "ownerId": ownerId,
      "action": actionSelected.name,
      "reaction": reactionSelected.name,
      "actionParams": actionSelected.paramstoJson(),
      "reactionParams": reactionSelected.paramstoJson(),
    };
    return areaJson;
  }

  void handleSubmitArea() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      Map<String, dynamic> areaJson = await areaToJson();
      print("AREA JSON = ${areaJson.values}");
      final http.Response response = await apiService.sendAreaJson(context, areaJson);
      if (response.statusCode == 201) {
        showSuccessDialog();
      } else {
        setState(() {
          errorMessage = 'Login failed: ${response.body}';
          print(response.body);
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(widget.translationManager.getText("areaCreatedPage", "successTitle"),
            style: const TextStyle(
            color: Color(0xFF1E3A8A),
            fontFamily: 'Murecho',
            fontSize: 22,
            fontWeight: FontWeight.bold)
          ),
          content: const Text('AREA submitted successfully!'),
          actions: [
            ElevatedButton(
              onPressed:() => {
                Navigator.of(context).pop(),
                Navigator.pushReplacementNamed(context, '/home')},
              child: const Text('OK',
                style: TextStyle(
                color: Color(0xFF1E3A8A),
                fontFamily: 'Murecho',
                fontSize: 22,
                fontWeight: FontWeight.bold),)
            ),
          ],
        );
      },
    );
  }
  @override
  Widget build(BuildContext context) {
    
    double screenWidth = MediaQuery.of(context).size.width;
    
    return Scaffold(
      backgroundColor: Colors.white,
      
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90.0),
        child: CustomNavBar1(translationManager: widget.translationManager, onSwitchLanguage: widget.onSwitchLanguage),
      ),
      
      body: Column(
        children: [
          RowTitle(
            title: widget.translationManager.getText("areaCreatedPage", "pageTitle"), 
            buttonTitle: widget.translationManager.getText("areaCreatedPage", "backButton"),
            fontColor: const Color(0xFF1E3A8A),
            buttonBgdColor: const Color(0xFF1E3A8A)
          ),
          SizedBox(height: screenWidth  < 600 ? 90 : 150),
          ifttComp(context),
        ],
      ),
    );
  }

  Widget ifttComp(BuildContext context) {

    double screenWidth = MediaQuery.of(context).size.width;
    final areaState = Provider.of<AreaState>(context, listen: false);
    final actionServiceSelected = areaState.actionServiceSelected;
    final reactionServiceSelected = areaState.reactionServiceSelected;
    final actionSelected = areaState.actionSelected;
    final reactionSelected = areaState.reactionSelected;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ComplexIftttComp(
            title: widget.translationManager.getText("areaCreatedPage", "ifTitle"),
            iconPath: actionServiceSelected!.dataService!.iconPath,
            color: actionServiceSelected.dataService!.color,
            body: actionSelected!.labelEn,
          ),
          const SizedBox(height: 10.0),
          Icon(
            Icons.arrow_downward,
            color: Colors.grey.shade600,
            size: screenWidth < 600 ? 40.0 : 70.0,
          ),
          const SizedBox(height: 10.0),
          ComplexIftttComp(
            title: widget.translationManager.getText("areaCreatedPage", "thenTitle"),
            iconPath: reactionServiceSelected!.dataService!.iconPath,
            color: reactionServiceSelected.dataService!.color,
            body: reactionSelected!.labelEn,
          ),
          const SizedBox(height: 20.0,),
          ElevatedButton(
            onPressed:() => {
              handleSubmitArea() },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
              backgroundColor: const Color(0xFF1E3A8A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(
              widget.translationManager.getText("areaCreatedPage", "submitButton"),
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
    );
  }
}
