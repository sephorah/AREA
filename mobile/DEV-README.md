#  AREA mobile app

This is a mobile application using the framework Flutter and language Dart.

## Starting the Flutter mobile application

Prerequisites:
- Flutter SDK: Make sure the Flutter SDK is installed. If not, follow the instructions provided below.
- Android SDK: Make sure the Android SDK is installed, and ```adb ``` is available in your terminal.
- Emulator: Make sure you have an Android emulaotr installed or use a physical device for testing.

## How To Install Flutter

Depending on the architecture of your computer , you have different way.
Follow the turorial in the next link:
https://docs.flutter.dev/get-started/install

Then, verify the installation by running:

```
flutter doctor
```
This command checks your environment and displays a report of the FLutter installation. If there are any missing dependencies, ```flutter doctor``` will tell how to install them.

## 1. Running the AREA Flutter Application on a Web Browser

First, make sure that web support is enabled in your Flutter project.
Check, by running:
```
flutter devices
```
Run the following command to start the app on web browser:
```
flutter run -d chrome --web-port=8082
```
You can have access to the app, by opening the app on your browser and visit:
http://localhost:8082

## 2. Running the AREA Flutter Application in Dev Mode in a Mobile device

First, start an Android Emulator:
- list available emulators:
```
flutter emulators
```

- Start an emulator:
```
flutter emulators --lauch <emulator_id>
```

- Check the running emulators:
```
adb devices
```
- Once the emulator is running, you can use the following command to run the mobile app in development mode on the emulator.
```
flutter run
```
## 3. Building and Running the APK on an Android Emulator

1/ List the available emulators:
```
flutter emulators
```

2/ Start an emulator:
``` 
flutter emulators --launch <emulator_id>
```

3/ Verify that the emulator is running:
```
adb devices
```

4/ Build a release APK
```
flutter build apk --release
```
if the APK was generated successfully, you will find it in the build/app/outputs/flutter-apk/app-release.apk

5/ Install and Run the APK on the Emulator:
```
adb install build/app/outputs/flutter-apk/app-release.apk
```
Lauch your app on the emulator, you will find it with all the apps already installed.
