import 'package:flutter/material.dart';
import 'package:mobile/class/services.dart';


class AreaState with ChangeNotifier {
  List<Service>? actionsServices;
  List<Service>? reactionsServices;
  Service? actionServiceSelected;
  ActionReaction? actionSelected;
  Service? reactionServiceSelected;
  ActionReaction? reactionSelected;

  void deleteAllStates() {
    actionsServices = null;
    reactionsServices = null;
    actionServiceSelected = null;
    actionSelected = null;
    reactionServiceSelected = null;
    reactionSelected = null;
    notifyListeners();
  }

  void setListActionsServices(List<Service> actionsServicesList) {
    actionsServices = actionsServicesList;
    notifyListeners();
  }

  void setListReactionsServices(List<Service> reactionsServicesList) {
    reactionsServices = reactionsServicesList;
    notifyListeners();
  }

  void setActionServiceSelected(Service service) {
    actionServiceSelected = service;
    actionSelected = null;
    notifyListeners();
  }

  void setActionSelected(ActionReaction action) {
    actionSelected = action;
    notifyListeners();
  }

  void setReactionServiceSelected(Service service) {
    reactionServiceSelected = service;
    reactionSelected = null;
    notifyListeners();
  }

  void setReactionSelected(ActionReaction reaction) {
    reactionSelected = reaction;
    notifyListeners();
  }
  bool get isAreaComplete =>  actionSelected != null && reactionSelected != null;
}