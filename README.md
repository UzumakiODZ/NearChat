# NearChat 💬📍

> Connect with the people physically around you — no mutual friends, no swiping, just real proximity.

Have you ever gone alone to a concert, club, or restaurant and wished you could connect with the people nearby? NearChat makes that effortless. Open the app, see who's around you right now, and start a conversation.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [App Screens](#app-screens)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Download](#download)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

NearChat is a **hyper-local real-time chat app** built with React Native and Expo. It uses your device's GPS to surface users within a configurable radius, lets you filter by distance, age, and gender preference, and delivers instantaneous messaging via WebSockets — even when the app is in the background, thanks to push notifications.

This repository is the **frontend** of NearChat. The backend is a separate Express + PostgreSQL service hosted on Render.

---

## Features

| Feature | Description |
|---|---|
| 📍 **Proximity Discovery** | Fetches users within a configurable radius using `expo-location` GPS data |
| 💬 **Real-Time Messaging** | Persistent WebSocket connection via `socket.io-client` for zero-lag chat |
| 🔔 **Background Notifications** | Expo push notifications with **inline reply** — answer without opening the app |
| 🎚️ **Discovery Filters** | Slider-based controls for distance (1–150 km), age (18–100+), and gender |
| 🔗 **Link Previews** | URLs inside messages are automatically expanded into rich previews (title, image, description) |
| 🔐 **JWT Authentication** | Secure login/sign-up flow with token stored in AsyncStorage |
| 🌗 **Dark / Light Mode** | Automatically adapts to the device's system theme |
| 📱 **Cross-Platform** | Targets Android and iOS from a single codebase |

---

## App Screens

```
WelcomePage  ──►  LoginPage  ──►  NearbyUser  ──►  ChatUi
                      │
                   SignUp ──► WelcomePage
```

| Screen | Description |
|---|---|
| **WelcomePage** | First-run screen for setting a display name after registration |
| **LoginPage** | Email + password login; requests location permission on success |
| **SignUp** | Registration form with validation (email, username, password confirmation) |
| **NearbyUser** | Main feed — lists all nearby users with distance; includes the filter panel |
| **ChatUi** | Full-screen conversation view with real-time messaging and link previews |

---

## Tech Stack

### Frontend
| Category | Library / Tool |
|---|---|
| Framework | React Native 0.81, React 19 |
| Build toolkit | Expo ~54, `expo-dev-client` |
| Navigation / Routing | `expo-router` (file-system based) |
| Real-time | `socket.io-client` ^4.8 |
| Storage | `@react-native-async-storage/async-storage` |
| Location | `expo-location` |
| Notifications | `expo-notifications`, `expo-device` |
| UI | `react-native-safe-area-context`, `@react-native-community/slider`, `@react-native-picker/picker`, `expo-haptics` |
| Language | TypeScript 5.9 |

### Backend (reference)
The backend API (`https://backendchat-o6c5.onrender.com`) is built with **Express**, **PostgreSQL**, and **Prisma ORM**.

---

## Architecture

```
┌─────────────────────────────────────┐
│           React Native App          │
│                                     │
│  LoginPage / SignUp                 │
│       │  JWT token → AsyncStorage   │
│       ▼                             │
│  NearbyUser                         │
│    ├─ GET /nearby-users/:id         │
│    └─ PreferenceSetter (filters)    │
│       │                             │
│       ▼                             │
│  ChatUi                             │
│    ├─ GET  /messages                │  HTTP (Fetch / Axios)
│    └─ socket.io ──────────────────────────────────────┐
│                                     │                 │
│  NotificationHandler                │  Expo Push      │
│    ├─ registerForPushNotifications  │  Notifications  │
│    └─ POST /update-push-token       │                 │
└─────────────────────────────────────┘                 │
                                                        │
             ┌──────────────────────────────────────────┘
             │         Express + PostgreSQL Backend
             │  /login  /register  /nearby-users
             │  /messages  /update-location
             │  /update-push-token
             └──────────────────────────────────────────
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node) or yarn
- A **physical Android or iOS device** (push notifications require a real device)
- [Expo Go](https://expo.dev/client) **or** a custom dev build (this project uses `expo-dev-client`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UzumakiODZ/NearChat.git
   cd NearChat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Metro bundler and open the Expo developer menu:
```bash
npx expo start
```

Run directly on a connected device or emulator:
```bash
npm run android   # Android device / emulator
npm run ios       # iOS device / simulator (macOS only)
```

> **Note:** The first native build will take several minutes to compile. Subsequent hot-reload cycles are fast.

---

## Project Structure

```
NearChat/
├── app/
│   ├── (tabs)/
│   │   ├── ChatUi.tsx           # Real-time chat screen
│   │   ├── NearbyUser.tsx       # Proximity feed + filter panel
│   │   ├── NotificationHandler.tsx  # Push notification registration & reply
│   │   └── _layout.tsx          # Tab navigator layout
│   ├── LoginPage.tsx            # Login screen
│   ├── SignUp.tsx               # Registration screen
│   ├── WelcomePage.tsx          # Post-registration onboarding
│   └── _layout.tsx              # Root layout + auth guard
├── components/
│   ├── PreferenceSetter.tsx     # Distance / age / gender filter panel
│   ├── ThemedText.tsx           # Theme-aware text component
│   ├── ThemedView.tsx           # Theme-aware view component
│   └── ...
├── constants/
│   ├── config.ts                # BASE_URL and other app-wide constants
│   └── Colors.ts                # Design token colours
├── hooks/
│   ├── useColorScheme.ts        # System dark/light mode hook
│   └── useThemeColor.ts         # Themed colour resolver
├── assets/                      # Images, icons, and fonts
├── app.json                     # Expo app configuration
├── eas.json                     # EAS Build configuration
└── tsconfig.json                # TypeScript configuration
```

---

## Configuration

The backend URL is defined in `constants/config.ts`:

```ts
export const BASE_URL = 'https://backendchat-o6c5.onrender.com';
```

Change this value to point at a self-hosted backend instance. All screens and the notification handler read from this single constant.

The Expo project ID (required for push notifications) is set in `app.json` under `extra.eas.projectId` and mirrored inside `NotificationHandler.tsx`.

---

## Download

Grab the latest Android build directly from Expo:

**[⬇ Download APK](https://expo.dev/accounts/bigshow67/projects/frontEnd/builds/74438683-66ea-469f-9e51-d1f0b375b7b4)**

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch.
2. Make your changes and ensure the app builds without errors (`npx expo start`).
3. Open a pull request with a clear description of what you changed and why.

Please open an issue first for large changes so we can discuss the approach.

---

## License

[MIT](LICENSE)
