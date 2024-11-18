import 'package:flutter/material.dart';
import 'rowTitle.dart';

class CustomBanner extends StatelessWidget {
  final String title;
  final String buttonTitle;
  final String? subtitle;
  final String? iconPath;
  final Color bgdColor;
  final Color fontColor;

  const CustomBanner({
    required this.title,
    required this.buttonTitle,
    this.subtitle,
    this.iconPath,
    required this.bgdColor,
    required this.fontColor,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Container(
      height: screenWidth < 600 ? 250 : 300,
      color: bgdColor,
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          RowTitle(
            title: title,
            buttonTitle: buttonTitle,
            fontColor: fontColor,
            buttonBgdColor: Colors.transparent,
            borderSide: const BorderSide(
              color: Colors.white,
              width: 2.0,
            ),
          ),
          const SizedBox(height: 16),
          if (iconPath != null)
            Flexible(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12.0),
                child: Image.asset(
                  iconPath!,
                  width: screenWidth < 600 ? 80 : 100,
                  height: screenWidth < 600 ? 80 : 100,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          const SizedBox(height: 5),
          if (subtitle != null)
            Flexible(
              child: Text(
                subtitle!,
                style: TextStyle(
                  fontSize: screenWidth < 600 ? 20 : 24,
                  fontFamily: 'Murecho',
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
