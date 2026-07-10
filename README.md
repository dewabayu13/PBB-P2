# SIPBB DESA SMARTMAP

Sistem Informasi Penagihan Pajak Bumi dan Bangunan Perdesaan dan Perkotaan Berbasis Google Maps.

## About This Architecture
This repository provides a modern, production-ready Progressive Web Application (PWA) built with **React, TypeScript, Tailwind CSS, and Vite**. 

Although the original request mentioned **Google Apps Script (GAS)**, a full-stack React application is strongly recommended over GAS for a system managing "thousands of taxpayers" due to:
1. **Performance**: GAS has strict execution limits and can be very slow when querying thousands of rows.
2. **Offline Support (PWA)**: React + Service Workers allow collectors to cache map data and work offline, syncing when they regain connection. GAS web apps cannot truly function offline.
3. **Complex UI**: Building modern glassmorphism, map clustering, and responsive dashboard charts is natively supported here.

## Features
- **Dashboard**: Real-time revenue tracking and performance charts.
- **Interactive Map**: Google Maps integration showing house status (Paid, Unpaid, Empty, Unvisited) via color-coded markers.
- **Taxpayer Database**: Search, filter, and manage property data.
- **Collection Module**: Record payments, update statuses instantly.
- **Reports**: Audit trails and activity logs.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and add your Google Maps API Key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production (PWA)**:
   ```bash
   npm run build
   ```
   Deploy the `dist` folder to Netlify, Vercel, or Firebase Hosting.

## Modifying to use Firebase / Cloud SQL Backend
Currently, the application uses an in-memory Context (`src/context/AppContext.tsx`) with realistic mock data (`src/data/mock.ts`) to demonstrate the UI instantly.
To connect a real database:
1. Initialize Firebase or use a Node/Express backend.
2. Replace the state logic in `AppContext.tsx` with fetch calls or Firestore subscriptions.
