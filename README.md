# AREA

## Project overview

The AREA (Action-REAction) project is an automation platform inspired by services like IFTTT and Zapier. This platform allows users to connect various digital services by setting up "Actions" and corresponding "REActions" to automate tasks across platforms. Users can create automated workflows (known as AREA) by connecting a triggering event (Action) to a specified outcome (REAction) between supported services, like Google , Github, Spotify etc.

The project is divided into three main components:

Application Server: Central hub for business logic and service integrations. 
Web Client: Provides a browser-based interface for users to create, manage, and interact with AREA workflows.
Mobile Client: Allows users to interact with the platform on mobile devices, mirroring the functionality of the web client.


## Preview

### Web

![Web - Home page](./assets/web-homepage.png)

![Web - Login page](./assets/web-login-page.png)

![Web - Create area page](./assets/web-create-area-page.png)

![Web - Create area page after the user set the AREA](./assets/web-create-area-page2.png)

![Web - User's AREAs page](./assets/web-areas-list-page.png)

### Mobile

![Mobile - Create area page](./assets/mobile-home-page.png)

![Mobile - Create area page](./assets/mobile-create-area.png)

![Mobile - Choose your service](./assets/mobile-choose-service-page.png)

![Mobile - User's AREAs page](./assets/mobile-areas-list-page.png)


## Set up the project environment
1. Create a .env file at the root, and for each microservice
2. For each .env.example, set the environment variables in a .env file

## Getting Started
Run the docker-compose to start building and running the project.
Do this command:
```
docker compose build && docker compose up
```

Then, you will need to set up ngrok by running the following commands:
```
ngrok config add-authtoken ${NGROK_AUTHTOKEN}
ngrok http --url=communal-engaged-mudfish.ngrok-free.app 8080
```

### Developers

| [<img src="https://github.com/bapwood.png?size=85" width=85><br><sub>Baptiste Fouillet</sub>](https://github.com/bapwood) | [<img src="https://github.com/sephorah.png?size=85" width=85><br><sub>Séphorah Aniambossou</sub>](https://github.com/sephorah) | [<img src="https://github.com/yasssb.png?size=85" width=85><br><sub>Yasmine BEDRANE</sub>](https://github.com/yasssb) | [<img src="https://github.com/ismadpk.png?size=85" width=85><br><sub>Ismaïel DIAPAKA</sub>](https://github.com/ismadpk)
| :---: | :---: | :---: | :---: |

**Sephorah** and **Baptiste** were responsible for developing the **application server**, handling user management, authentication, microservices integration, and all other core functionalities.

**Yasmine** has built the **mobile application**, ensuring user-friendly interaction with the application server and AREA setup on mobile devices.

**Ismaïel** has worked on the **web client**, providing users with a responsive and accessible interface to manage their AREAs.
