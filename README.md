# Todo App with Theme Switcher

A sophisticated Todo List application built with React Native (Expo) featuring light/dark theme switching and real-time backend integration using Convex.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- 🎨 Light and dark theme support with smooth transitions
- 💾 Persistent theme preference across app restarts
- 🔄 Real-time updates via Convex
- 🎯 Filter todos by All, Active, or Completed
- ✏️ Inline editing of todos
- 🗑️ Delete functionality
- 📱 Drag and drop to reorder todos
- 🎭 Empty states and loading indicators
- ♿ Accessibility compliance 
- 📱 Responsive on all screen sizes

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Convex account (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/BenedictUmeozor/todo-app-hng-stage-3.git
cd todo-app-hng-stage-3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Convex Setup

1. Sign up for a free account at [Convex](https://convex.dev)

2. Install Convex CLI globally (if not already installed):
```bash
npm install -g convex
```

3. Initialize Convex in your project:
```bash
npx convex dev
```

4. This will:
   - Create a new Convex project
   - Generate a `.env.local` file with your `CONVEX_DEPLOYMENT` and `EXPO_PUBLIC_CONVEX_URL`
   - Start the Convex development server

5. Keep the Convex dev server running in a separate terminal

### 4. Environment Variables

The `.env.local` file should contain:

```env
CONVEX_DEPLOYMENT=dev:your-deployment-name
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

These are automatically generated when you run `npx convex dev`.

## Build Commands

### Development

Start the Expo development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### Platform-Specific

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Production Build

```bash
# Build for all platforms
npx expo build

# Export for web
npx expo export --platform web
```

## Project Structure

```
├── app/                    # Main app screens
│   ├── index.tsx          # Home screen with todo list
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── header.tsx         # Header with theme toggle
│   ├── todo-input.tsx     # Input field for new todos
│   ├── todo-list.tsx      # List container with empty states
│   ├── todo-row.tsx       # Individual todo item
│   ├── animated-todo-row.tsx  # Animated wrapper
│   └── filter-tabs.tsx    # Filter buttons
├── convex/                # Backend (Convex)
│   ├── schema.ts          # Database schema
│   └── todos.ts           # CRUD operations
├── hooks/                 # Custom React hooks
│   ├── theme-context.tsx  # Theme management
│   └── use-todos.ts       # Todo operations
├── constants/             # App constants
│   └── theme.ts           # Theme colors
└── assets/                # Images and fonts
```

## Usage

### Adding Todos
- Type in the input field at the top
- Press Enter or the submit button

### Editing Todos
- Tap on any todo text to edit inline
- Press the checkmark to save or X to cancel

### Completing Todos
- Tap the circle checkbox to mark as complete/incomplete

### Deleting Todos
- Tap the X button on the right side of any todo

### Reordering Todos
- Long press and drag any active todo to reorder

### Filtering
- Use the All/Active/Completed tabs to filter your view

### Theme Switching
- Tap the sun/moon icon in the header to toggle themes
- Your preference is automatically saved

### Clear Completed
- Tap "Clear Completed" at the bottom to remove all completed todos

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Convex** - Real-time backend and database
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions
- **AsyncStorage** - Local storage for theme preference
- **TypeScript** - Type safety

## Troubleshooting

### Convex Connection Issues
- Ensure `npx convex dev` is running
- Check that `.env.local` has the correct `EXPO_PUBLIC_CONVEX_URL`
- Restart the Expo dev server after changing environment variables

### Theme Not Persisting
- Check that AsyncStorage permissions are granted
- Clear app data and restart

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `npx expo start -c`

## 👤 Author

**Benedict Umeozor**  
GitHub: [@BenedictUmeozor](https://github.com/BenedictUmeozor)
