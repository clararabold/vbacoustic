# VBAcoustic Monorepo

A complete building acoustics solution with TypeScript calculation library and modern React web interface.

## 🏗️ Monorepo Structure

This repository contains two main packages:

- **`packages/lib`** - TypeScript acoustic calculation library ([@vbacoustic/lib](./packages/lib))
- **`packages/web-ui`** - React web application for acoustic calculations ([@vbacoustic/web-ui](./packages/web-ui))

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/USERNAME/vbacoustic-ts-3.git
cd vbacoustic-ts-3
```

2. Install all dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

```

3. Build the acoustic library:
```bash
npm run build:lib
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to [http://localhost:5173](http://localhost:5173)

## 📦 Available Scripts

### Root Level Commands

- `npm run build:lib` - Build the acoustic calculation library
- `npm run build:ui` - Build the React web application
- `npm run build` - Build both packages
- `npm run dev` - Start the development server for the web UI
- `npm run test:lib` - Run tests for the acoustic library
- `npm run publish:lib` - Publish the library to npm (after building)

### Package-Specific Commands

```bash
# Work with the library
cd packages/lib
npm run build
npm run test
npm run dev

# Work with the web UI
cd packages/web-ui
npm run build
npm run dev
npm run preview
```

## 🏗️ Architecture

### Acoustic Library (`packages/lib`)

Professional-grade TypeScript implementation of building acoustics calculations:

- **Standards Support**: DIN 4109, ISO 12354, VIBROAKUSTIK
- **Construction Types**: Massivbau, Massivholzbau, Leichtbau
- **Calculations**: Sound reduction, flanking transmission, impact sound
- **VBA Compatibility**: Exact formula implementation from original VBA code

### Web UI (`packages/web-ui`)

Modern React single-page application:

- **Multi-step Calculator**: Guided acoustic calculation workflow
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Results**: Instant calculation feedback
- **Standards Compliance**: Visual indicators for building regulations

## 🧮 Supported Calculations

- **Sound Reduction (Rw)**: Mass law and laboratory measurements
- **Layer Improvements (ΔRw)**: Cladding, screed, and insulation layers
- **Flanking Transmission**: Complete flanking path analysis
- **Impact Sound (Lnw)**: Floor impact sound calculations
- **Junction Analysis**: T-joint and X-joint attenuation
- **Combined Results**: Energetic addition and weighting

## 📋 Standards Compliance

- **DIN 4109**: German building acoustics standard
- **ISO 12354**: International standard for building acoustics prediction
- **VIBROAKUSTIK**: Advanced vibro-acoustic calculations

## 🚀 Deployment

The web UI is automatically deployed to GitHub Pages when pushing to the main branch. The workflow:

1. Builds the acoustic library
2. Builds the React application
3. Deploys to GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes in the appropriate package
4. Run tests: `npm run test:lib`
5. Build everything: `npm run build`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Acoustic Library Documentation](./packages/lib/README.md)
- [Web UI Documentation](./packages/web-ui/README.md)
- [Live Demo](https://USERNAME.github.io/vbacoustic-ts-3/)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Integration with VBAcoustic Library

This UI is designed to work with the VBAcoustic TypeScript library for acoustic calculations. To integrate:

1. Install the acoustic library as a dependency
2. Import calculation functions in your components
3. Use the existing type definitions and validators

## Deployment to GitHub Pages

The project includes GitHub Actions workflow for automatic deployment. Update the `homepage` field in `package.json` with your repository URL before deploying.

## Development

The development server is currently running at http://localhost:5173

### Next Steps

1. **Integrate Acoustic Library**: Add your TypeScript acoustic library as a dependency
2. **Implement Form Logic**: Connect the calculator forms to actual calculation functions
3. **Add State Management**: Implement Zustand for global state management
4. **Create Validation**: Add form validation using your existing validators
5. **Build Results Display**: Implement charts and detailed results visualization
6. **Add Presets**: Create material and construction presets for quick input

## License

MIT License

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
