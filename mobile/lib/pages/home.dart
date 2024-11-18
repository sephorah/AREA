import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:mobile/widgets/navBar1.dart';


class HomePage extends StatefulWidget {
  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  const HomePage({
    super.key,
    required this.translationManager,
    required this.onSwitchLanguage,
  });

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {

  bool isEnglish = true;

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Scaffold(
      backgroundColor: Colors.white,
      
      appBar: CustomNavBar1(translationManager: widget.translationManager, onSwitchLanguage: widget.onSwitchLanguage,),

      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 50),
                buildWelcomeSection(context, screenWidth),
                const SizedBox(height: 50),
                buildActionSection(),
                const SizedBox(height: 40),
                buildContributorSection(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildWelcomeSection(BuildContext context, double screenWidth) {
    return Container(
      constraints: const BoxConstraints(
        maxWidth: 600,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 5,
            blurRadius: 7,
            offset: const Offset(0, 3),
          ),
        ],
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Text(
            widget.translationManager.getText('landingPage', 'welcomeMessage'),
            style: TextStyle(
              fontSize: screenWidth < 600 ? 30 : 45,
              fontWeight: FontWeight.bold,
              fontFamily: "Murecho",
              color:const Color(0xFF1E3A8A),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            widget.translationManager.getText('landingPage', 'description'),
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 14, color: Colors.grey, fontFamily: "Murecho"),
          ),
        ],
      ),
    );
  }

  Widget buildActionSection() {
    return Column(
      children: [
        Text(
          widget.translationManager.getText('landingPage', 'services'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color:Color(0xFF1E3A8A),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          constraints: const BoxConstraints(
            maxWidth: 800,
            maxHeight: 800,
          ),
          child: GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 2,
            childAspectRatio: 1,
            children: List.generate(
              dataServices.length,
              (index) => buildAreaButton(dataServices[index]),
            ),
          ),
        ),
      ],
    );
  }

  Widget buildContributorSection() {
    return Column(
      children: [
        Text(
          widget.translationManager.getText('landingPage', 'contributors'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1E3A8A),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          constraints: const BoxConstraints(
            maxWidth: 800,
            maxHeight: 400,
          ),
          child: GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 4,
            mainAxisSpacing: 6,
            crossAxisSpacing: 6,
            childAspectRatio: 1,
            children: [
              buildContributorBox('Ismaiel', "assets/icons/isma.png", const Color(0xFF2196F3)),
              buildContributorBox('Baptiste', "assets/icons/baptiste.png", const Color(0xFF4CAF50)),
              buildContributorBox('Sephorah', "assets/icons/sephorah.png", const Color(0xFF9C27B0)),
              buildContributorBox('Yasmine',"assets/icons/yass.png",const Color(0xFFFF4081)),
            ],
          ),
        ),
      ],
    );
  }

  Widget buildAreaButton(DataService service) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: service.color,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: 60,
            width: 60,
            child: Image.asset(
              service.iconPath,
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            service.serviceName,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontFamily: "Murecho",
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget buildContributorBox(String name, String iconPath, Color color) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Flexible(
            child: CircleAvatar(
              radius: 22,
              backgroundColor: Colors.white,
              child: ClipOval(
                child: Image.asset(
                  iconPath,
                  width: 35,
                  height: 35,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Flexible(
            child: Text(
              name,
              style: const TextStyle(
                fontSize: 12,
                fontFamily: "Murecho",
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}