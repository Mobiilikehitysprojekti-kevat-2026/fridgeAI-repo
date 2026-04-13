# FridgeAI — Smart Fridge & Recipe Assistant

> Scan your fridge, discover recipes, and cook step-by-step with AI. Built with React Native (Expo) + Express.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [State Management](#state-management)
- [Internationalisation](#internationalisation)
- [Testing](#testing)
- [Scripts](#scripts)

---

## Overview

FridgeAI is a cross-platform mobile application that lets you photograph the contents of your fridge and instantly receive AI-generated recipe suggestions tailored to what you already have. The app guides you through every cooking step hands-free, tracks your pantry inventory, and curates a daily recipe catalogue.

---

## Features

| Feature | Description |
|---|---|
| **Camera Scan** | Photograph fridge contents; GPT-4o identifies ingredients with confidence scores |
| **Pantry Hub** | Manually manage your ingredient inventory (add, edit, delete) |
| **AI Recipe Suggestions** | Recipes generated from detected ingredients via OpenAI |
| **Ask Fridge** | Free-text query ("what can I make with eggs and pasta?") |
| **Daily Recipe Catalogue** | Time-slotted daily recipe feed with Pexels imagery |
| **Cooking Mode** | Step-by-step guided cooking with timer and text-to-speech |
| **Nutrition Estimates** | Per-recipe macro breakdown (calories, protein, carbs, fat) |
| **Analysis Statistics** | Historical scan analytics and ingredient frequency charts |
| **Saved Recipes** | Persist favourite recipes locally with AsyncStorage |
| **Multilingual** | English and Finnish UI; auto-detects device locale |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Native App (Expo)             │
│                                                      │
│  RootNavigator ─► Screens ─► Zustand Stores         │
│                         └─► TanStack Query ─► API   │
└────────────────────────────────┬────────────────────┘
                                 │ HTTP (REST)
                    ┌────────────▼────────────┐
                    │   Express Backend        │
                    │                          │
                    │  Routes ─► Controllers   │
                    │       └─► IngredientSvc  │
                    │              └─► OpenAI  │
                    │              └─► Pexels  │
                    └──────────────────────────┘
```

The mobile app and backend live in the **same repository**. The backend is a thin Express server that proxies to OpenAI and Pexels — all AI logic lives inside `IngredientService`.

---

## Tech Stack

### Mobile (frontend)

| Layer | Library |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | React Navigation v7 (native stack) |
| Server State | TanStack React Query v5 |
| Client State | Zustand v5 |
| i18n | i18next + react-i18next |
| Charts | react-native-chart-kit |
| Persistence | AsyncStorage |
| Language | TypeScript 5.9 (strict) |

### Backend

| Layer | Library |
|---|---|
| Runtime | Node.js + tsx |
| Framework | Express 5 |
| AI | OpenAI SDK v6 (`gpt-4o`) |
| Image search | Pexels REST API |
| Security | Helmet, CORS, express-rate-limit |
| Validation | Zod v4 |
| Language | TypeScript 5.9 (strict) |

---

## Project Structure

```
.
├── App.tsx                    # App entry — providers only
├── index.ts                   # Expo entry point
├── app.json                   # Expo project config
├── package.json
├── backend/
│   ├── src/
│   │   ├── app.ts             # Express app factory
│   │   ├── index.ts           # Server bootstrap
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Error handler, etc.
│   │   ├── routes/            # analysisRoutes, healthRoutes
│   │   ├── services/
│   │   │   ├── IngredientService.ts   # AI analysis + recipe generation
│   │   │   └── dailyRecipeCatalog.ts  # Time-slotted daily feed
│   │   └── types/
│   └── tests/
├── src/
│   ├── api/                   # React Query hooks + queryClient
│   ├── components/            # Shared UI components
│   ├── config/                # App-wide constants
│   ├── hooks/                 # Custom hooks
│   ├── i18n/                  # i18next setup + locale resources
│   ├── navigation/            # RootNavigator + type definitions
│   ├── repositories/          # AsyncStorage read/write layer
│   ├── screens/               # One file per screen
│   │   ├── PantryHubScreen.tsx
│   │   ├── RecipesHubScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── AnalysisLoadingScreen.tsx
│   │   ├── IngredientsScreen.tsx
│   │   ├── MealSuggestionsScreen.tsx
│   │   ├── RecipeScreen.tsx
│   │   ├── CookingModeScreen.tsx
│   │   ├── CompletionScreen.tsx
│   │   ├── AnalysisStatisticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/                 # Zustand stores
│   ├── theme/                 # Color palette + typography
│   ├── types/                 # Shared TypeScript types (api.ts)
│   └── utils/
├── docs/                      # Project planning docs
├── tests/                     # Frontend store unit tests
└── .env.example
```

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Expo CLI**: `npm install -g expo-cli` (or use `npx expo`)
- **Expo Go** app on your physical device (iOS / Android), or a simulator
- **OpenAI API key** — required for all AI features
- **Pexels API key** — required for recipe and ingredient images

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd mobiili-projekti-full
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your keys (see [Environment Variables](#environment-variables)).

### 3. Start the backend

```bash
# Terminal 1
npm run backend:start
```

The API will be available at `http://127.0.0.1:3000/api/v1`.  
Verify it with: `curl http://127.0.0.1:3000/api/v1/health`

### 4. Start the mobile app

```bash
# Terminal 2
npx expo start --ios      # iOS Simulator
npx expo start --android  # Android Emulator
npx expo start            # Expo Go (scan QR)
```

---

## Environment Variables

Copy `.env.example` to `.env` and populate it:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI secret key — powers ingredient detection and recipe generation |
| `PEXELS_API_KEY` | ✅ | Pexels API key — fetches food imagery for recipes and ingredients |
| `PORT` | No | Backend HTTP port (default: `3000`) |
| `HOST` | No | Backend bind address (default: `0.0.0.0`) |
| `OPENAI_MODEL` | No | OpenAI model to use (default: `gpt-4o`) |
| `MAX_IMAGE_SIZE_MB` | No | Maximum upload size in MB (default: `5`) |
| `EXPO_PUBLIC_API_URL` | No | Override backend URL for physical device (e.g. `http://192.168.1.10:3000/api/v1`) |

> **Note:** `EXPO_PUBLIC_API_URL` is only needed when the Expo app on a physical device cannot automatically reach your local backend. Set it to your machine's LAN IP.

---

## Running the App

### Development modes

```bash
npm run start              # Expo dev server (choose platform interactively)
npm run start:tunnel       # Expo with ngrok tunnel (useful for physical devices)
npm run ios                # Run on iOS simulator (requires Xcode)
npm run android            # Run on Android emulator (requires Android Studio)
npm run web                # Run in browser (Expo Web)
```

### Backend modes

```bash
npm run backend:dev        # tsx watch — restarts on file change
npm run backend:start      # Run backend once (no auto-reload)
```

### Clean restart (if the app shows stale UI)

```bash
npx expo start --clear
```

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok" }` |

### Analysis

| Method | Path | Description |
|---|---|---|
| `POST` | `/analyze` | Upload a fridge photo; returns detected ingredients + a suggested recipe |
| `POST` | `/analyze/ask-fridge` | Free-text query with optional pantry list; returns recipe suggestions |
| `GET` | `/analyze/daily-recipes` | Returns today's time-slotted recipe catalogue |
| `POST` | `/analyze/ingredient-images` | Fetch Pexels images for a list of ingredient names |
| `POST` | `/analyze/generate-recipe` | Generate a recipe from an explicit ingredient list |

#### `POST /analyze` — Request

```json
{
  "imageBase64": "<base64-encoded image>",
  "mimeType": "image/jpeg",
  "locale": "en"
}
```

#### `POST /analyze` — Response

```json
{
  "requestId": "uuid",
  "detectedIngredients": [
    { "name": "Egg", "confidence": 0.97, "category": "protein", "quantity": "6" }
  ],
  "suggestedRecipe": {
    "id": "uuid",
    "title": "Spanish Omelette",
    "cuisine": "Spanish",
    "difficulty": "easy",
    "totalTimeMinutes": 20,
    "servings": 2,
    "ingredients": [...],
    "steps": [...],
    "nutritionEstimate": { "calories": 350, "proteinG": 18, "carbsG": 12, "fatG": 22 }
  },
  "processingTimeMs": 1842
}
```

#### Rate limiting

The backend enforces **10 requests per minute** per IP in production mode. Integration tests disable this with `enableRateLimit: false`.

---

## State Management

Four Zustand stores manage client state:

| Store | Purpose |
|---|---|
| `appShellStore` | Global UI state: active tab, bottom sheet visibility |
| `askFridgeSessionStore` | Session state for the free-text "Ask Fridge" flow |
| `cookingSessionStore` | Current recipe, active step index, cooking timer |
| `preferencesStore` | User preferences: locale, dietary settings |

Server state (recipes, analysis results, daily catalogue) is managed by **TanStack React Query** via hooks in `src/api/`.

Persistent data (saved recipes, pantry inventory) is read/written through the `src/repositories/` layer backed by AsyncStorage.

---

## Internationalisation

The app supports two locales:

| Code | Language |
|---|---|
| `en` | English (default) |
| `fi` | Finnish |

The device locale is detected automatically via `expo-localization`. If the device locale is not supported, the app falls back to English. Users can override the language from the **Settings** screen. RTL layout support is enabled.

Translation files live in `src/i18n/resources/`.

---

## Testing

```bash
npm test
```

Runs all tests with the Node.js built-in test runner via `tsx`:

- `backend/tests/IngredientService.test.ts` — service-layer integration tests
- `backend/tests/app.test.ts` — HTTP endpoint tests (Supertest)
- `tests/appShellStore.test.ts` — Zustand store unit tests
- `tests/askFridgeSessionStore.test.ts` — Zustand store unit tests

```bash
npm run typecheck   # Full TypeScript check (frontend + backend)
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `expo start` | Launch Expo dev server |
| `start:tunnel` | `expo start --tunnel` | Launch with ngrok tunnel |
| `ios` | `expo run:ios` | Build & run on iOS |
| `android` | `expo run:android` | Build & run on Android |
| `web` | `expo start --web` | Launch in browser |
| `backend:dev` | `tsx watch backend/src/index.ts` | Backend with live reload |
| `backend:start` | `tsx backend/src/index.ts` | Start backend once |
| `typecheck` | `tsc --noEmit` | Check types (both packages) |
| `lint` | alias for `typecheck` | TypeScript validation |
| `test` | `tsx --test ...` | Run all tests |
