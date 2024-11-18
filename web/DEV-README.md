#  AREA web app

This is a web application using the framework Nexts.js and language TypeScript.

## Start the Next.js application

Prerequisites:
- Node.js : Make sure Node.js is installed, with vesrion 14 or more. If not, follow the instructions provided below.
- npm : Make sure npm is installed. If not, follow the instructions provided below.

### How to install Node.js

Follow this [tutorial](https://nodejs.org/en/download/package-manager)

Then, verify the installation:
```
node --version
```

This command displays the current version of Node.js installed on your system.

### How to install npm

Follow this [tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Then, verify the installation:
```
npm --version
```

This command displays the current version of Node.js installed on your system.

### 1. Installing dependency of the AREA Next.js Application
First :
```
mv web
```
Then:
```
npm install
```

###  2. Running the AREA Next.js Application in Dev Mode 

```
npm run dev
```

You can have access to the app, by opening the app on your browser and visit:
`http://localhost:3000`

### 3. Building and Running the AREA Next.js Application in PROD Mode 

First:
```
npm run build
```
After:
```
npm run start
```

You can have access to the app, by opening the app on your browser and visit:
`http://localhost:8081`
