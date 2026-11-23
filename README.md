# Terra Land Portal (React Native / Expo SDK 58, front end only)

A mobile + web app for managing land purchases with a real estate company. All data is mock data held in memory (no backend), so it resets when the app reloads.

## Requirements
- Node.js 22.13+ (or 24.3+ / 26+). Odd-numbered Node versions (23, 25) are not supported by SDK 58.
- On a phone: the Expo Go app updated to the SDK 58 version.

## Run it

```bash
npm install
npx expo start
```

- **Browser:** press `w` in the terminal, or run `npm run web`. It opens at http://localhost:8081
- **Phone:** scan the QR code with Expo Go (same Wi-Fi). If it won't connect, use `npx expo start --tunnel`.
- **Emulators:** press `a` (Android) or `i` (iOS, macOS only).

## Demo login
Any valid email and a password of 6+ characters.

## Publish the web version
```bash
npx expo export --platform web
```
Upload the generated `dist` folder to any static host (Netlify, Vercel, Firebase Hosting, etc.).

## Structure

```
App.js                      entry, providers, phone-width layout on web
src/context/AppContext.js   app state + actions (purchase, pay, book, notify)
src/data/mock.js            listings, seed purchases, plans, FAQs, company info
src/navigation/index.js     tabs + stack navigation
src/screens/                all screens
src/components/             shared UI (Card, Button, Badge, ProgressBar...)
src/alert.js                alerts that also work in the browser
src/utils.js                money/date helpers, document unlock rules
```

## Connecting a backend later
Replace the actions in `AppContext.js` (`login`, `createPurchase`, `makePayment`, `bookInspection`) with API calls and swap the seed data in `mock.js` for fetched data.
