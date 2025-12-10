# Premium Food App 🍽️

A premium food delivery app built with React Native and Expo, featuring a calm and minimalist design system.

## 🚀 Quick Start

### Run on iOS Phone (Recommended)

1. **Install Expo Go** on your iPhone from the App Store
2. **Start the development server:**
   ```bash
   cd premium-food-app
   npm install --legacy-peer-deps
   npm start
   ```
3. **Scan the QR code** with Expo Go app
4. **Enjoy the app** on your phone!

### Run on Web (Vercel Deployment)

1. **Deploy to Vercel:**
   - Push to GitHub
   - Connect to [vercel.com](https://vercel.com)
   - Auto-deploy in 2 minutes

2. **Or run locally:**
   ```bash
   npm run web
   ```

## 📱 Features

✅ **Premium Design System**
- Calm, minimalist aesthetic
- Sage green (#AFC8A6) and warm beige (#F7F5F0) color palette
- Gentle animations and glassmorphism effects
- 44px minimum touch targets

✅ **Complete Food Delivery Experience**
- Restaurant discovery with map view
- Spin wheel for random restaurant selection
- Menu browsing and cart management
- Secure checkout with payment methods
- Order tracking and confirmation
- User profile management

✅ **Cross-Platform Ready**
- Native iOS/Android with Expo
- Web version with React Native Web
- Responsive design for all screen sizes

## 🛠️ Tech Stack

- **React Native** + **Expo** for cross-platform development
- **TypeScript** for type safety
- **Styled Components** for styling
- **Zustand** for state management
- **React Navigation** for routing
- **Property-Based Testing** with fast-check

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens
├── navigation/     # Navigation configuration
├── stores/         # State management
├── designSystem/   # Design tokens and theme
├── utils/          # Utility functions
└── types/          # TypeScript definitions
```

## 🎨 Design System

The app follows a premium design system with:

- **Colors:** Sage green primary, warm beige backgrounds, soft cream accents
- **Typography:** Clean, readable fonts with proper hierarchy
- **Spacing:** Generous whitespace (12-28px system)
- **Animations:** Gentle 200-400ms transitions with ease-out curves
- **Components:** Consistent button styles, input fields, and cards

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## 📱 Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

**Run on iPhone:**
1. Install Expo Go
2. `npm start`
3. Scan QR code

## 🔧 Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Run on specific platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 📄 License

Private project - All rights reserved.