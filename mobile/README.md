# AREA Flutter App

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This mobile application lets users create automated workflows by selecting "Actions" and "Reactions" between different services. Inspired by IFTTT, it simplifies automation for day-to-day tasks by triggering specific events on connected accounts like Google or Spotify, allowing users to build their own "Action-REACTION" (AREA) processes.

## Table of Contents:

1. Features
2. Screenshots
3. Installation
4. Usage
6. Project Structure
7. UX/UI Chart

## Features
- User Authentication: Supports Google, Spotify, Github, Discord and standard email login
- AREA Creation: Build customized AREA workflows with selected Actions and Reactions
- User Data Management: Comprehensive profile management features
- Multi-Language Support: Available in English and French
- Admin Controls: Admin page displaying a list of all registered users.

## Installation

See the DEV-README.md

## Usage

1. Registration and Login:
Users can sign up using various methods, including Google OAuth, Spotify, GitHub, Discord, or with the account created during registration.

2. Service Subscription: 
Once authenticated, users can subscribe to a list of services we provide to create their AREA workflows..

3. AREA Creation: 
Users can set up AREA workflows by specifying:
- Action: Select a trigger event from any connected service.
- Reaction: Choose an outcome based on the selected service's Action.

6. Managing Profiles:
Each user can view and manage their profile details and review the AREAs they have created.

## Project Structure

- `assets`: Contains all the assets of the app

    - `fonts/`: Contains all the fonts of the app

    - `icons/`: Contains all the icons , .png of the app

    - `lang/`: Contains the `en.json` and `fr.json` of the app

- `lib/`: Contains all the source code for the app

    - ```main.dart```: The entry point to the app

    - `pages/`: Contains all the screens/pages of the app

        - `landingPage.dart`: The landing page

        - `home.dart`: The home page

        - `login.dart`: The login page

        - `signup.dart`: The signup page

        - `profile.dart`: The profile page

        - `createAction.dart`: The create action page.

        - `chooseService.dart`: The choose service page. 

        - `connectService.dart`: The connect service page. 

        - `chooseAction.dart`: The choose action page. 

        - `createReaction.dart`: The create reaction page. 

       - `chooseReaction.dart`: The choose reaction page. 

        - `editActionReaction.dart`: The edit action / reaction choosed page.

        - `areaCreated.dart`: The area created, details of the area page. Final step of the AREA worflow.

        - `allApplets.dart`: The all applets page, all the area created.
    
    - `(api)/`:

        - `api.dart`: Handles API requests to the backend
    
    - `(auth)/`:

        - `auth.dart`: Manages user authentication states

        - `authGuard.dart`: Implements route protection for authenticated pages
    
    - `class/`:

        - `services.dart`: Defines data models for the AREA process.
    
    - `provider/`:

        - `areaState.dart`: Manages AREA - related state for the app

        - `serverState.dart`:  Manages network location states.
    
    - `translation/`:

        - `translationManager.dart`: Handles language translation between french and english.

    - `widgets/`:

        - `customBanner.dart`: Custom banner used in each page.

        - `customCardInputs.dart`: Custom input card widgets for settings, editing object

        - `customeOauthWebView.dart`: OAuth web view widget.

        - `profileCard.dart`: Widget displaying profile info in a card format with editing mode

        - ` gridCards.dart`: Reusable Grid card layout widget

        - `navBar1.dart`: Main navigation bar widget

        - `navBar2.dart`: Secondary navigation bar widget
    
## UX/UI Chart

[Our mockups](https://www.figma.com/design/cOgTabLVrlGnRn0FcYcvrh/Mockups-AREA?node-id=0-1&t=RgAnA8RQ7EmwjxOC-1)

[Our Style Guide](https://www.figma.com/board/gK3km4aeqRPIxDytyR9qEO/AREA---Style-Guide?node-id=1-22&t=RgAnA8RQ7EmwjxOC-1)

