# NearChat

Have you ever gone alone to a concert, club, restaurant, and wished you could connect with people nearby? Did you ever want to approach a nearby person but could not think of any way to? NearChat brings you closer to the people around you, right from your phone.

## Overview

This repository contains the front-end application for **NearChat**, built using React Native and Expo. The app leverages device geolocation, real-time socket connections, and push notifications to provide a seamless hyper-local chatting experience.

## Features

- **Local Discovery:** Uses device geolocation (`expo-location`) to find and show nearby users.
- **Real-Time Messaging:** Utilizes `socket.io-client` for persistent WebSocket connections, ensuring instantaneous message updates on the chat screen.
- **Offline Notifications:** Uses `expo-notifications` to send new messages directly to your notification panel when you are offline or the app is in the background.
- **Cross-Platform:** Built with React Native and Expo, targeting both Android and iOS devices.

## Tech Stack & Core Dependencies

- **Framework:** React Native (v0.81), React (v19.1.0)
- **Toolkit & Routing:** Expo (v54), `expo-router`
- **Networking:** Axios, Socket.io-client
- **State/Storage:** `@react-native-async-storage/async-storage`
- **Device APIs:** `expo-location`, `expo-notifications`, `expo-device`, `expo-haptics`
- **Backend Infrastructure (Reference):** Express, PostgreSQL, Prisma ORM

## APK Link

[Download the latest build from Expo](https://expo.dev/accounts/bigshow67/projects/frontEnd/builds/74438683-66ea-469f-9e51-d1f0b375b7b4)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For physical devices: The [Expo Go](https://expo.dev/client) app installed on your iOS or Android device (though this project uses development builds via `expo-dev-client`).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UzumakiODZ/frontEnd.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontEnd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:
```bash
npx expo start
```
Alternatively, to run natively on connected devices or emulators:
```bash
npm run android
# or
npm run ios
```

## Project Structure

- `app/` - Contains the `expo-router` based file-system routing screens.
- `components/` - Reusable UI components.
- `hooks/` - Custom React hooks.
- `assets/` - Static assets like images and fonts.
- `constants/` - App-wide constants and configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve the app.

## License

MIT
