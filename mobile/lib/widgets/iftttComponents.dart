// ignore: file_names
import 'package:flutter/material.dart';

class SimpleIftttComp extends StatelessWidget {
  final String title;
  final bool isButton;
  final String buttonTitle;
  final Color color;
  final Function() onPressed;

  const SimpleIftttComp({
    super.key,
    required this.title,
    required this.isButton,
    required this.buttonTitle,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth < 600 ? screenWidth * 0.9 : screenWidth * 0.6;
    double fontSize = screenWidth < 600 ? 26.0 : 34.0;
    double paddingHorizontal = screenWidth < 600 ? 24.0 : 40.0;

    return Container(
      width: containerWidth,
      padding: EdgeInsets.symmetric(vertical: 24.0, horizontal: paddingHorizontal),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(
            child: Padding(
              padding: const EdgeInsets.only(right: 10.0),
              child: Text(
                title,
                style: TextStyle(
                  fontFamily: 'Murecho',
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontSize: fontSize,
                ),
                maxLines: 1,
                overflow: TextOverflow.visible,
              ),
            ),
          ),
          if (isButton)
            ElevatedButton.icon(
              onPressed: onPressed,
              icon: const Icon(Icons.add, color:Color(0xFF1E3A8A)),
              label: const Text(
                'Add',
                style: TextStyle(
                  color:Color(0xFF1E3A8A),
                  fontFamily: 'Murecho',
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                foregroundColor: const Color(0xFF1E3A8A),
                backgroundColor: Colors.white,
              ),
            ),
        ],
      ),
    );
  }
}

class ComplexIftttComp extends StatelessWidget {
  final String title;
  final String iconPath;
  final Color color;
  final String body;

  const ComplexIftttComp({
    super.key,
    required this.title,
    required this.iconPath,
    required this.color,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    double containerWidth = screenWidth < 600 ? screenWidth * 0.9 : screenWidth * 0.6;
    double fontSize = screenWidth < 600 ? 28.0 : 34.0;
    double appLogoSize = screenWidth < 600 ? 70 : 100;
    double paddingHorizontal = screenWidth < 600 ? 15.0 : 40.0;
    double radiusLogo = screenWidth < 600 ? 15 : 25;

    return Container(
      width: containerWidth,
      padding: EdgeInsets.symmetric(vertical: 24.0, horizontal: paddingHorizontal),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Flexible(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5.0),
              child: Text(
                title,
                style: TextStyle(
                  fontFamily: 'Murecho',
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontSize: fontSize,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
          SizedBox(width: screenWidth < 600 ? 16 : 24),
          ClipRRect(
            borderRadius: BorderRadius.circular(radiusLogo),
            child: Image.asset(
              iconPath,
              width: appLogoSize,
              height: appLogoSize,
              fit: BoxFit.contain,
            ),
          ),
          SizedBox(width: screenWidth < 600 ? 16 : 24),
          Expanded(
            flex: 3,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5.0),
              child: Text(
                body,
                style: TextStyle(
                  fontFamily: 'Murecho',
                  fontWeight: FontWeight.bold,
                  color: const Color.fromARGB(255, 255, 255, 255),
                  fontSize: screenWidth < 600 ? 20.0 : 24.0,
                ),
              textAlign: TextAlign.start,
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
