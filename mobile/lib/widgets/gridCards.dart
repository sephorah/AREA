import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';
import 'package:mobile/translation/translationManager.dart';

class GridCards extends StatefulWidget {
  final List<ActionReaction> actionsReactions;
  final Color color;
  final Function(ActionReaction) onEventSelected;
  final TranslationManager translationManager;


  const GridCards({
    super.key,
    required this.actionsReactions,
    required this.color,
    required this.onEventSelected,
    required this.translationManager,
  });

  @override
  GridCardsState createState() => GridCardsState();
}

class GridCardsState extends State<GridCards> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount = constraints.maxWidth > 1200
            ? 5
            : constraints.maxWidth > 900
                ? 4
                : constraints.maxWidth > 600
                    ? 3
                    : 2;
        double padX = constraints.maxWidth > 1200
            ? 100
            : constraints.maxWidth > 900
                ? 50
                : 20;
        double aspectRatio = constraints.maxWidth > 1200
            ? 1.2
            : constraints.maxWidth > 900
                ? 1
                : constraints.maxWidth > 600
                    ? 0.8
                    : 0.7;

        return Padding(
          padding: EdgeInsets.symmetric(horizontal: padX),
          child: GridView.builder(
            itemCount: widget.actionsReactions.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              crossAxisSpacing: 20.0,
              mainAxisSpacing: 15.0,
              childAspectRatio: aspectRatio,
            ),
            itemBuilder: (context, index) {
              String label = widget.translationManager.currentLanguage == 'en'
                  ? widget.actionsReactions[index].labelEn
                  : widget.actionsReactions[index].labelFr;
              return InkWell(
                onTap: () {
                  print("ON TAP ==> ${widget.actionsReactions[index].name}");
                  widget.onEventSelected(widget.actionsReactions[index]);
                },
                child: CustomCard(
                  content: label,
                  color: widget.color,
                ),
              );
            },
          ),
        );
      },
    );
  }
}

class CustomCard extends StatelessWidget {
  final String content;
  final Color color;

  const CustomCard({
    super.key,
    required this.content,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double contentSize = screenWidth > 1200
        ? 22
        : screenWidth > 900
            ? 20
            : screenWidth > 600
                ? 20
                : 18;
    return Card(
      color: color,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: Text(
                content,
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: 'Murecho',
                  fontWeight: FontWeight.bold,
                  fontSize: contentSize,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
