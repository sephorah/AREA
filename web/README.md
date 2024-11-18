# AREA - Next Frontend

This web application, of project AREA (Action REAction), lets users to configure "action-reaction" scenarios between different services. Similar to the IFTTT (If This Then That) concept. It simplifies automation for day-to-day tasks by triggering specific events on connected accounts like Google or Spotify, etc.

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

- `public/`:

    - `(asset)/`: Contains all the assets of the web site

    - `fonts/`: Contains all the fonts of the web site

    - `icons/`: Contains all the icons, .png of the web site

 - `messages`: Contains the `en.json` and `fr.json` of the web site

    - `en.json`: Contains all the messages in english of the web site

    - `en.json`: Contains all the messages in french of the web site

- `app/`: Contains all the source code for the web site

    - `[locale]/`: Contains all the pages of the web site
        
        - `_not-found/`: _not-found page of the web site
            
            - `page.tsx`: Contains pages when page is not found in the web site
        
        - `areas-created/`: areas-created page of the web site

            - `(components)/`: All components of areas created page 

                - `CardCreatedArea.tsx` : Component to display card of area created

            - `page.tsx` : All the area created.

        - `choose-reaction/`: choose-reaction page of the web site

            - `page.tsx` : Containe all reactions of the service choose

        - `choose-service/`: choose-service page of the web site

            - `(components)/`: All components of choose service page 

                - `CardForService.tsx` : Component to display card of service

            - `page.tsx` : Containe all services to choose
        
        - `choose-trigger/`: choose trigger page of the web site

            - `page.tsx` : Containe all trigger of the service choose

        - `create-area/`: create area page of the web site
            
            - `(components)/`: All components of create area page 

                - `DivActionReaction.tsx` : Component to handle difference steps of workflow
            
            - `page.tsx` : Containe difference steps of workflow
                
        - `login/`: login page of web site 
            
            - `(components)/`: All components of login page 

                - `ButtonConnexionOAuth.tsx` : Component to handle the way to connect with OAuth
            
            - `page.tsx` : Containe all way to login in web site
        
        - `oauth2/`: oauth2 page of web site

            - `(components)/`: All components of oauth2 page 

                - `OAuthCallBaxk.tsx` : Component to handle the way to connect with OAuth
            
            - `discord/` : Containe tha way to handle connexion with discord
                
                - `page.tsx` : oauth2/discord of the web site
            
            - `github/` : Containe tha way to handle connexion with github
                
                - `page.tsx` : oauth2/github of the web site
            
            - `google/` : Containe tha way to handle connexion with google
                
                - `page.tsx` : oauth2/google of the web site
            
            - `spotify/` : Containe tha way to handle connexion with spotify
                
                - `page.tsx` : oauth2/spotify of the web site

        - `profile/`: profile page of web site

            - `page.tsx` : Containe all data user's

        - `register/`: register page of web site
            
            - `(components)/`: All components of login page 

                - `formRegister.tsx` : Component to handle the way to register in web site
            
            - `page.tsx` : Containe the way to register in web site
                
        - `set-params/`: set-params page of web site

            - `page.tsx` : Containe the way to set params of Action or Reaction when user create an AREA
        
        - `globals.css`: Is used to define global styles applied to the entire site.
        
        - `layout.tsx`: Is used to define the basic structure of each page of your application.
        
        - `page.tsx`: Containe landing and home page od the web site
    
    - `api/`: Handles API calls to the backend

        - `api.ts`:Create base URL of the backend
        
        - `auth.ts`: Manages user authentication states
        
        - `service.ts`: Handles API requests for services to the backend
        
        - `user.ts`: Manages user states

    - `auth/`:

        - `auth.ts`: Set access token in cookie

    - `components/`:

        - `ButtonToShowPassword.tsx`: Button to view password

        - `CardForArea.tsx`: Component to display the triggers and reactions

        - `ChooseArea.tsx`: Component to display page who display triggers and reactions

        - `Colors.tsx`: Component to handle all differences colors of the services

        - `DeleteAllCookies.tsx`: Component to delete all cookies in app

        - `Logos.tsx`: Component to handle all differences logos of the services

        - `NavBar.tsx`: Navigation bar widget
    
    - `type`:  Contains all the types for the app
    
## UX/UI Chart

Our mockups:
https://www.figma.com/design/cOgTabLVrlGnRn0FcYcvrh/Mockups-AREA?node-id=0-1&t=RgAnA8RQ7EmwjxOC-1

Our Style Guide:
https://www.figma.com/board/gK3km4aeqRPIxDytyR9qEO/AREA---Style-Guide?node-id=1-22&t=RgAnA8RQ7EmwjxOC-1


## Authors

- Baptiste Fouillet - bapwood
- Yasmine Bedrane - yass
- Sephorah Aniambossou - sephorah
- Ismaïel Diapaka - ismadpk
