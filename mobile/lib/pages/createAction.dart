import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/(auth)/authGuard.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/pages/chooseService.dart';
import 'package:mobile/provider/areaState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/iftttComponents.dart';
import 'package:mobile/widgets/navBar1.dart';
import 'package:mobile/widgets/rowTitle.dart';
import 'package:provider/provider.dart';

class CreateActionPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const CreateActionPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  CreateActionPageState createState() => CreateActionPageState();
}

class CreateActionPageState extends State<CreateActionPage> {
  
  bool isEnglish = true;
  late Future<void> _initFuture;

   @override
  void initState() {
    super.initState();
    _initFuture = initializeAREAprovider();
  }

  Future<void> initializeAREAprovider() async {
    final api = ApiService();
    final provider = Provider.of<AreaState>(context, listen: false);
    try {
      print("Initializing AREA provider");
      List<Service> allServices = await api.getAllServices(context);
      print("All services: $allServices");
      List<Service> actionsServices = await api.getActionsServices(allServices);
      List<Service> reactionsServices = await api.getReactionsServices(allServices);
      provider.setListActionsServices(actionsServices);
      provider.setListReactionsServices(reactionsServices);
    } catch (error) {
      print('Error fetching services: $error');
      rethrow;
    }
  }

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
        builder: (context) => AuthGuard(destPage:ChooseServicePage(
          isAction: true,
          translationManager: widget.translationManager,
          onSwitchLanguage: widget.onSwitchLanguage,
        )),
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
        child: CustomNavBar1(translationManager: widget.translationManager, onSwitchLanguage: widget.onSwitchLanguage),
      ),
      body: FutureBuilder<void>(
        future: _initFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error loading services: ${snapshot.error}'));
          } else {
            return SingleChildScrollView(
              child: Column(
                children: [
                  RowTitle(
                    title: widget.translationManager.getText("createActionPage", "pageTitle"), 
                    buttonTitle: widget.translationManager.getText("createActionPage", "backButton"), 
                    fontColor: const Color(0xFF1E3A8A), 
                    buttonBgdColor: const Color(0xFF1E3A8A)
                  ),
                  SizedBox(height: screenWidth < 600 ? 60 : 120),
                  ifttComp(context),
                ],
              ),
            );
          }
        },
      ),
    );
  }

  Widget ifttComp(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SimpleIftttComp(
            title: widget.translationManager.getText("createActionPage", "ifThisTitle"),
            isButton: true,
            buttonTitle: widget.translationManager.getText("createActionPage", "addButton"),
            color: const Color(0xFF1E3A8A),
            onPressed: onAddButtonPressed,
          ),
          const SizedBox(height: 10.0),
          Icon(
            Icons.arrow_downward,
            color: Colors.grey.shade600,
            size: screenWidth < 600 ? 40.0 : 70.0,
          ),
          const SizedBox(height: 10.0),
          SimpleIftttComp(
            title: widget.translationManager.getText("createActionPage", "thenThatTitle"),
            isButton: false,
            buttonTitle: "Add",
            color: const Color.fromARGB(255, 115, 147, 237),
            onPressed: onAddButtonPressed,
          ),
        ],
      ),
    );
  }
}
