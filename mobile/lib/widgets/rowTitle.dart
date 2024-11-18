import 'package:flutter/material.dart';

class RowTitle extends StatelessWidget {

  final String title;
  final String buttonTitle;
  final Color fontColor;
  final Color buttonBgdColor;
  final BorderSide? borderSide;

  const RowTitle({super.key, 
    required this.title,
    required this.buttonTitle,
    required this.fontColor,
    required this.buttonBgdColor,
    this.borderSide,
  });

  @override
  Widget build(BuildContext context) {

    double screenWidth = MediaQuery.of(context).size.width;

    return Padding(
      padding: const EdgeInsets.all(26.0),
      child: Stack (
        alignment: Alignment.center,
        children: [
          if (screenWidth > 600)
            Align (
              alignment: Alignment.centerLeft,
              child: ElevatedButton.icon(
                onPressed: () { Navigator.of(context).pop(); },
                icon: const Icon(Icons.arrow_back),
                label: Text(
                  buttonTitle,
                  style: const TextStyle(
                    color: Colors.white,
                    fontFamily: 'Murecho',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
                  foregroundColor: Colors.white,
                  backgroundColor: buttonBgdColor,
                  elevation: 0,
                  side: borderSide,
                ),
              )
            ),
            Align(
              alignment: Alignment.center,
              child: Text(
                title,
                style: TextStyle(
                  color: fontColor,
                  fontFamily: 'Murecho',
                  fontSize: screenWidth < 600 ? 34 : 50,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
          ),
        ],
      ),  
    );
  }
}