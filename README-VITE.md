# MindMate - React + Vite Version

A mental health companion app built with React, Vite, and TypeScript.

## Features

- 🧠 **AI Journal Assistant** - Write or speak your thoughts and get AI-powered insights
- 😊 **Mood Tracking** - Log your emotions and get personalized recommendations  
- 🏥 **Health Assistant** - Describe symptoms and get health insights
- 📊 **Progress History** - Track your wellness journey over time
- 🎯 **Goal Tracking** - Set and monitor daily wellness goals
- 🌙 **Dark/Light Mode** - Comfortable viewing in any lighting
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   └── ...             # Feature components
├── pages/              # Page components
├── lib/                # Utilities and helpers
├── hooks/              # Custom React hooks
└── main.tsx           # App entry point
```

## Navigation

All navigation now uses React Router with proper routing:

- `/` - Home page with quick actions
- `/journal` - AI journal assistant
- `/mood` - Mood tracking and history
- `/health` - Health symptom assistant
- `/history` - Progress and history overview
- `/settings` - App settings and preferences

## Mobile Support

The app is fully responsive with:
- Touch-friendly navigation
- Mobile-optimized layouts
- Bottom navigation bar on mobile
- Proper touch targets and gestures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.