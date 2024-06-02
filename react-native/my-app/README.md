# What Should I Eat? Mobile App Documentation

## Overview

The purpose of this readme file is to provide context for how to run the mobile application wtihin this subfolder.

## Recommended Pre-requisites

The following tools are recommended to run the application. 
The goal of this readme file is to be platform agnostic, but the following tools related heavily to a MacOS / iOS environment.

`Simulator`

![Screen Shot 2024-06-02 at 3 15 25 PM](https://github.com/torieee/WSIE/assets/122702221/128680e0-516c-476f-bce4-6506eb43dd99)

![Screen Shot 2024-06-02 at 3 17 41 PM](https://github.com/torieee/WSIE/assets/122702221/9feae954-11c8-47de-aafe-72047407ad98)

Simulator is a convient tool to use to simulate various types of iOS devices. Simulator is able to "run" the mobile app from MacOS devices.

Simulator can be downloaded from the application store with the [following instructions](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators).

`Expo App`

![Screen Shot 2024-06-02 at 3 30 54 PM](https://github.com/torieee/WSIE/assets/122702221/515e06b5-fdc7-4ba2-b84f-1466daa62329)

While the Simulator desktop app can run the mobile application, another tool to run the platform on is the Expo mobile application. Once the project is running, one can access the application on a mobile device if the mobile device is on the same network as the desktop running the app.

To download the Expo app, refer to the following
- [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779)
- [Android App via Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&pli=1)

## Running the Application Locally

To run the application locally, first ensure you are within the app's directory local. Starting from the root of the overall project, run:

`cd react-native/my-app`

Now from within this location, run:

`npm run`

At this point, the following screen shall appear within the console. If the Expo app is installed on a mobile device (on the same local network), scanning the QR code enables the app to load within the Expo app on your local mobile device.

![Screen Shot 2024-06-02 at 3 55 02 PM](https://github.com/torieee/WSIE/assets/122702221/6b3124a4-cfbc-4d26-a3ee-d843e89d258f)

Type `i` - this will start the mobile app on the iOS Simulator if the Simulator is open. 

Alternatively, the iOS Simulator can be launched directly by running the `npm run ios` command.

**It is important to note that this application is currently configured to run locally only. This requires the Docker containers to be active while running the mobile app. To run the containers, return to the root of the project and run the `npm start` command.**

*If you're running this mobile application for an android device, the instructions remain the same except the run command is instead `npm run android`. Similarly, the Docker containers would have to be running concurrently. An android device simulator may also be necessary.*

For the previous commands which specifically relate to the mobile application, any instances of `npm run` can be replaced with `npx expo start`.
