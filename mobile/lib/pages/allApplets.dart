import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/navBar1.dart';

class AllAppletsPage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const AllAppletsPage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  AllAppletsPageState createState() => AllAppletsPageState();
}

class AllAppletsPageState extends State<AllAppletsPage> {
  bool isEnglish = true;
  final ApiService apiService = ApiService();
  List<AREA> areas = [];
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    getUserListAreas();
  }

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });
    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  Future<void> getUserListAreas() async {
    try {
      final Map<String, dynamic> areasJson = await apiService.getUserAreas(context);
      List<AREA> listAreas = [];
      for (var areaJson in areasJson['areas']) {
        String actionServiceName = areaJson['action'].toString().split('.')[0];
        String reactionServiceName = areaJson['reaction'].toString().split('.')[0];
        String actionLabelFr = areaJson['descriptionFrAction'];
        String reactionLabelFr = areaJson['descriptionFrReaction'];
        String actionLabelEn = areaJson['descriptionEnAction'];
        String reactionLabelEn = areaJson['descriptionEnReaction'];
        
        DataService? actionService = dataServices.firstWhere(
          (service) => service.key == actionServiceName,
          orElse: () => DataService(key: '', serviceName: '', iconPath: '', color: Colors.grey),
        );
        DataService? reactionService = dataServices.firstWhere(
          (service) => service.key == reactionServiceName,
          orElse: () => DataService(key: '', serviceName: '', iconPath: '', color: Colors.grey),
        );
        
        listAreas.add(
          AREA(
            actionServiceSelected: actionService,
            reactionServiceSelected: reactionService,
            actionStrEn: actionLabelEn,
            actionStrFr: actionLabelFr,
            reactionStrEn: reactionLabelEn,
            reactionStrFr: reactionLabelFr,
          ),
        );
      }
      setState(() {
        areas = listAreas;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load applets. Please try again: $e';
        print(errorMessage);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

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
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: Text(
              widget.translationManager.getText("allApplets", "pageTitle"),
              style: TextStyle(
                fontSize: screenWidth < 600 ? 36 : 48,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1E3A8A),
              ),
              textAlign: TextAlign.center,
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: areas.isEmpty
                  ? Center(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/createAction');
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                          backgroundColor: const Color(0xFF1E3A8A),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: Text(
                          widget.translationManager.getText("allApplets", "createButtonTitle"),
                          style: const TextStyle(fontSize: 18,fontFamily: "Murecho", fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    )
                  : AREAsGrid(areas: areas, translationManager: widget.translationManager),
            ),
          ),
        ],
      ),
    );
  }
}


class AREAsGrid extends StatelessWidget {
  
  final List<AREA> areas;
  final TranslationManager translationManager;

  
  const AREAsGrid({
    super.key,
    required this.areas,
    required this.translationManager,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return GridView.builder(
      padding: const EdgeInsets.all(10.0),
      itemCount: areas.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: screenWidth < 600 ? 2 : 4, 
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 10.0,
        childAspectRatio: 0.52,
      ),
      itemBuilder: (context, index) {
        return AREACard(area: areas[index], translationManager: translationManager);
      },
    );
  }
}

class AREACard extends StatelessWidget {

  final AREA area;
  final TranslationManager translationManager;
  
  const AREACard({
    super.key,
    required this.area,
    required this.translationManager,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Image.asset(
                  area.actionServiceSelected.iconPath,
                  width: 50,
                  height: 50,
                  fit: BoxFit.contain,
                ),
                Image.asset(
                  area.reactionServiceSelected.iconPath,
                  width: 50,
                  height: 50,
                  fit: BoxFit.contain,
                ),
              ],
            ),
            const SizedBox(height: 15),
            Text(
              translationManager.getText("allApplets", "ifThatLabel"),
              style: const TextStyle(
                fontSize: 18,
                fontFamily: "Murecho",
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E3A8A),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              translationManager.currentLanguage == 'en' ? area.actionStrEn : area.actionStrFr,
              style: const TextStyle(fontSize: 16, fontFamily: "Murecho", color: Colors.black, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              translationManager.getText("allApplets", "thenThatLabel"),
              style: const TextStyle(
                fontSize: 18,
                fontFamily: "Murecho",
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E3A8A),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              translationManager.currentLanguage == 'en' ? area.reactionStrEn : area.reactionStrFr,
              style: const TextStyle(fontSize: 16, fontFamily: "Murecho", color: Colors.black, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
