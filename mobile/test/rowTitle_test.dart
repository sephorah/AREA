import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/widgets/rowTitle.dart';
void main() {
  testWidgets('RowTitle does not render button on small screens', (WidgetTester tester) async {
    const smallScreen = Size(500, 800);

    const testWidget = MediaQuery(
      data: MediaQueryData(size: smallScreen),
      child: MaterialApp(
        home: Scaffold(
          body: RowTitle(
            title: 'Test Title',
            buttonTitle: 'Back',
            fontColor: Colors.black,
            buttonBgdColor: Colors.blue,
          ),
        ),
      ),
    );

    await tester.pumpWidget(testWidget);
    expect(find.text('Test Title'), findsOneWidget);
    expect(find.text('Back'), findsNothing);
  });
}
