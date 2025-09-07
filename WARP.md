# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Baymax Todo is a cross-platform React Native mobile application built with Expo Router and NativeWind for styling. It uses Appwrite as the backend-as-a-service for data management and authentication.

## Development Commands

### Environment Setup
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm run start
```

### Platform-specific Development
```bash
# iOS Simulator
pnpm run ios
# or
npx expo start --ios

# Android Emulator  
pnpm run android
# or
npx expo start --android

# Web Browser
pnpm run web
# or  
npx expo start --web
```

### Code Quality
```bash
# Lint code
pnpm run lint
# or
npx expo lint
```

### Project Reset
```bash
# Reset to blank project (moves current code to app-example/)
pnpm run reset-project
```

## Architecture Overview

### Key Technologies
- **Expo Router**: File-based routing with typed routes enabled
- **NativeWind**: Tailwind CSS for React Native styling
- **React Native Appwrite**: Backend services (authentication, database)
- **TypeScript**: Strong typing throughout the application

### Project Structure
```
app/
├── (tabs)/              # Tab navigator routes
│   ├── _layout.tsx      # Tab bar configuration
│   ├── index.tsx        # Home tab (placeholder)
│   └── today.tsx        # Main todo list view
├── _layout.tsx          # Root layout with authentication
├── globals.css          # Global NativeWind styles
└── index.tsx            # Root index (placeholder)

components/
├── CreateTodo.tsx       # Todo creation input component
└── TodoItem.tsx         # Individual todo item component

services/
└── appwrite.ts          # Appwrite client configuration and API functions
```

### Data Flow Architecture
1. **Authentication**: Automatic login handled in root layout (`app/_layout.tsx`)
2. **Data Layer**: Appwrite service (`services/appwrite.ts`) manages all backend interactions
3. **State Management**: Local React state with optimistic UI updates
4. **UI Components**: Reusable components with NativeWind styling

### Key Patterns
- **Expo Router**: Uses file-based routing with tab navigation structure
- **Environment Variables**: Appwrite configuration uses `EXPO_PUBLIC_*` prefixed env vars
- **TypeScript Interfaces**: Strong typing for data models (see `ITask` interface)
- **Optimistic Updates**: UI updates immediately, with backend sync handled asynchronously

## Environment Configuration

### Required Environment Variables
```bash
EXPO_PUBLIC_APPWRITE_ENDPOINT=        # Appwrite server endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=      # Appwrite project ID  
EXPO_PUBLIC_APPWRITE_DATABASE_ID=     # Appwrite database ID
```

### Appwrite Setup
- Database contains a "tasks" table/collection
- Hardcoded test authentication credentials in `services/appwrite.ts` (daniel@baymax.com)
- Uses TablesDB for database operations
- Use a single object parameter (params) for functions.

## Development Notes

### Styling System
- Uses NativeWind (Tailwind for React Native)
- Global styles in `app/globals.css`
- Component styling via `className` prop
- Tailwind config includes app/ and components/ directories

### Navigation Structure
- Root stack navigator with tab navigation
- Two main tabs: "Today" (functional) and "Home" (placeholder)
- Custom tab bar with Lucide React Native icons
- Headers hidden for custom styling

### Data Management
- Appwrite client configured with environment variables
- Automatic authentication on app launch
- CRUD operations for tasks (read, update completion status)
- Type-safe interfaces for all data models

### Common Development Tasks
When adding new features:
1. Add new routes in `app/` directory (file-based routing)
2. Create reusable components in `components/` 
3. Add API functions to `services/appwrite.ts`
4. Update TypeScript interfaces as needed
5. Style with NativeWind classes

### Testing
Currently no test setup - consider adding Jest/React Native Testing Library for future testing needs.
