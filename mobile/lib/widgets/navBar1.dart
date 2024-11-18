import 'package:flutter/material.dart';
import 'package:mobile/(api)/api.dart';
import 'package:mobile/provider/serverState.dart';
import 'package:mobile/translation/translationManager.dart';
import 'package:provider/provider.dart';

class CustomNavBar1 extends StatefulWidget implements PreferredSizeWidget {

  final TranslationManager translationManager;
  final Function(String) onSwitchLanguage;

  @override
  final Size preferredSize;

  const CustomNavBar1({super.key, required this.translationManager, required this.onSwitchLanguage})
    : preferredSize = const Size.fromHeight(90.0);
  
  @override
  CustomNavBar1State createState() => CustomNavBar1State();
  
}

class CustomNavBar1State extends State<CustomNavBar1> {

  bool isEnglish = true;

  void changeLang() {
    setState(() {
      isEnglish = !isEnglish;
    });

    String newLang = isEnglish ? 'en' : 'fr';
    widget.onSwitchLanguage(newLang);
  }

  void openServerLocationDialog(BuildContext context) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(widget.translationManager.getText("customNavBar", "serverSelectionTitle")),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextButton(
                  onPressed: () {
                    Provider.of<ServerState>(context, listen: false).isDefaultServer = true;
                    Navigator.of(context).pop();
                  },
                  child: const Text('http://localhost:8080',
                    style: TextStyle(
                      color: Color(0xFF1E3A8A),
                      fontFamily: 'Murecho',
                      fontSize: 18,
                      fontWeight: FontWeight.bold),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Provider.of<ServerState>(context, listen: false).isDefaultServer = false;
                    Navigator.of(context).pop();
                  },
                  child: const Text('http://localhost:8082',
                    style: TextStyle(
                    color: Color(0xFF1E3A8A),
                    fontFamily: 'Murecho',
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          );
        },
      );
    }

    void openHelpDialog(BuildContext context) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(widget.translationManager.getText("customNavBar", "helpTitle"),
                style: const TextStyle(
                        color: Color(0xFF1E3A8A),
                        fontFamily: 'Murecho',
                        fontSize: 18,
                        fontWeight: FontWeight.bold),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.translationManager.getText("customNavBar", "helpText"),
                  style: const TextStyle(
                    color: Colors.black,
                    fontFamily: 'Murecho',
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: Text(widget.translationManager.getText("customNavBar", "closeButton"),
                    style: const TextStyle(
                    color: Color(0xFF1E3A8A),
                    fontFamily: 'Murecho',
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          );
        },
      );
    }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 600) {
          return navBarFullScreen(context);
        } else {
          return navBarMobile(context);
        }
      },
    );
  }

  Widget navBarFullScreen(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      toolbarHeight: 90.0,
      automaticallyImplyLeading: false,
      title: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10.0),
        child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              InkWell(
                onTap: () {Navigator.pushNamed(context, '/home');},
                child: Image.asset(
                  'assets/app_icon.png',
                  width: 45,
                  height: 45,
                ),
              ),
              Flexible(
                child: Text(
                  widget.translationManager.getText('landingPage', 'appTitle'),
                  style: const TextStyle(
                    color: Color(0xFF1E3A8A),
                    fontFamily: 'Murecho',
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
        ),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 10.0),
          child: OutlinedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/createAction');
            },
            style: OutlinedButton.styleFrom(
              foregroundColor:const Color(0xFF1E3A8A),
              backgroundColor: Colors.transparent,
              side: const BorderSide(color: Color(0xFF1E3A8A)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            child: Text(
              widget.translationManager.getText("customNavBar", "createButton"),
              style: const TextStyle(
                color: Color(0xFF1E3A8A),
                fontFamily: 'Murecho',
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 10.0),
          child: OutlinedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/allApplets');
            },
            style: OutlinedButton.styleFrom(
              foregroundColor:const Color(0xFF1E3A8A),
              backgroundColor: Colors.transparent,
              side: const BorderSide(color: Color(0xFF1E3A8A)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            child: Text(
              widget.translationManager.getText("customNavBar", "myAppletsButton"),
              style: const TextStyle(
                color: Color(0xFF1E3A8A),
                fontFamily: 'Murecho',
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 10.0),
          child: Tooltip(
            message: widget.translationManager.getText("customNavBar", "profileTooltip"),
            child: IconButton(
              onPressed: () {
                Navigator.pushNamed(context, '/profile');
              },
              icon: const Icon(Icons.person, color: Color(0xFF1E3A8A)),
              iconSize: 40,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: Tooltip(
            message: widget.translationManager.getText("customNavBar", "languageTooltip"),
            child: IconButton(
              icon: ClipOval(
                child: Image.asset(
                  isEnglish ? 'assets/icons/UK.png' : 'assets/icons/FR.png',
                  width: 35,
                  height: 35,
                  fit: BoxFit.cover,
                ),
              ),
              onPressed: () {changeLang();},
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: Tooltip(
            message: widget.translationManager.getText("customNavBar", "helpTooltip"),
            child: IconButton(
              onPressed: () {
                openHelpDialog(context);
              },
              icon: const Icon(Icons.help_outline, color: Color(0xFF1E3A8A)),
              iconSize: 40,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: Tooltip(
            message: widget.translationManager.getText("customNavBar", "serverToolTip"),
            child: IconButton(
              onPressed: () {
                openServerLocationDialog(context);
              },
              icon: const Icon(Icons.help_outline, color: Color(0xFF1E3A8A)),
              iconSize: 40,
            ),
          ),
        ),
      ],
      bottom: const PreferredSize(
        preferredSize: Size.fromHeight(1.0),
        child: Divider(
          height: 1,
          thickness: 1,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget navBarMobile(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      toolbarHeight: 90.0,
      automaticallyImplyLeading: false,
      title: Padding (
        padding: const EdgeInsets.symmetric(vertical: 10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [

              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets/app_icon.png',
                    width: 45,
                    height: 45,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'AREA',
                    style: TextStyle(
                      color: Color(0xFF1E3A8A),
                      fontFamily: 'Murecho',
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),


              Row(
                children: [

                  IconButton(
                    icon: ClipOval(
                      child: Image.asset(
                        isEnglish ? 'assets/icons/UK.png' : 'assets/icons/FR.png',
                        width: 35,
                        height: 35,
                        fit: BoxFit.cover,
                      ),
                    ),
                    onPressed: () {changeLang();},
                  ),

                  IconButton(
                    icon: const Icon(Icons.menu, color: Color(0xFF1E3A8A), size: 40),
                    onPressed: () {
                      showModalBottomSheet(
                        context: context,
                        builder: (BuildContext context) {
                          return Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              ListTile(
                                leading: const Icon(Icons.create, color: Color(0xFF1E3A8A)),
                                title: Text(
                                  widget.translationManager.getText("customNavBar", "createButton"), 
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: () {
                                  Navigator.pushNamed(context, '/createAction');
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.dashboard, color: Color(0xFF1E3A8A)),
                                 title: Text(
                                  widget.translationManager.getText("customNavBar", "myAppletsButton"),
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: () {
                                  Navigator.pushNamed(context, '/allApplets');
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.person, color: Color(0xFF1E3A8A)),
                                title: Text(
                                  widget.translationManager.getText("customNavBar", "profileTooltip"), 
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: () {
                                  Navigator.pushNamed(context, '/profile');
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.help_outline, color: Color(0xFF1E3A8A)),
                                title: Text(
                                  widget.translationManager.getText("customNavBar", "helpTooltip"), 
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: () {
                                  openHelpDialog(context);
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.settings, color: Color(0xFF1E3A8A)),
                                title: Text(
                                  widget.translationManager.getText("customNavBar", "serverToolTip"),
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: ()  {
                                  openServerLocationDialog(context);
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.help_outline, color: Color(0xFF1E3A8A)),
                                title: Text(
                                  widget.translationManager.getText("customNavBar", "logoutTooltip"), 
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontFamily: 'Murecho',
                                    fontSize: 20,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                                onTap: ()  {
                                  ApiService().logout(context);
                                  Navigator.pushNamed(context, '/landingPage');
                                },
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1.0),
          child: Divider(
            height: 1,
            thickness: 1,
            color: Colors.grey,
          ),
        ),
      );
    }
}
