# VBAcoustic Web UI

A modern React web application for building acoustic calculations, providing a user-friendly interface for the VBAcoustic TypeScript library.

## 🎯 Overview

This single-page application (SPA) provides an intuitive interface for performing building acoustic calculations according to DIN 4109 and ISO 12354 standards. It integrates seamlessly with the `@vbacoustic/lib` TypeScript library to deliver professional-grade acoustic analysis.

## ✨ Features

- **Multi-step Calculator Wizard**: Step-by-step guidance for acoustic calculations
- **Construction Type Support**: Massivbau, Massivholzbau, and Leichtbau construction types
- **Standards Compliance**: DIN 4109 and ISO 12354 standards with visual indicators
- **Flanking Analysis**: Comprehensive flanking transmission calculations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Results**: Instant calculation feedback and validation
- **Export Functionality**: Download results in various formats
- **GitHub Pages Ready**: Optimized for static hosting

## 🛠️ Technology Stack

- **React 18** with TypeScript for type-safe component development
- **Vite** for fast build tooling and development server
- **Tailwind CSS** for utility-first responsive styling
- **React Router** for client-side navigation
- **React Hook Form** for performant form management with validation
- **Lucide React** for consistent iconography
- **@vbacoustic/lib** for acoustic calculations

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- The acoustic library package built (`@vbacoustic/lib`)

### Development Setup

1. Navigate to the web-ui package:
```bash
cd packages/web-ui
```

2. Install dependencies (if not already done from root):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🧮 Application Structure

### Pages

- **Home (`/`)**: Landing page with overview and quick start
- **Calculator (`/calculator`)**: Multi-step acoustic calculation wizard
- **Results (`/results`)**: Detailed calculation results and analysis
- **About (`/about`)**: Documentation and help

### Component Architecture

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── forms/            # Form components
│   │   ├── ElementForm.tsx
│   │   ├── MaterialForm.tsx
│   │   └── CalculationForm.tsx
│   └── ui/               # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── pages/                # Main application pages
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Global styles and Tailwind config
```

## 🏗️ Building Elements Input

The calculator supports comprehensive input for various building elements:

### Wall Elements
- **Material Properties**: Mass per unit area, thickness, Young's modulus
- **Layer Configurations**: Cladding systems, insulation layers
- **Junction Details**: Connection types and elastic interlayers
- **Laboratory Values**: Direct input of measured Rw values

### Floor/Ceiling Elements
- **Basic Properties**: Element mass, dimensions, material type
- **Floating Floor Systems**: Screed thickness, insulation properties
- **Impact Sound**: Floor coverings and improvement layers
- **Ceiling Systems**: Suspended ceilings and resonator systems

### Construction Types
- **Massivbau**: Solid construction (concrete, masonry, CLT)
- **Massivholzbau**: Mass timber construction with specific junction handling
- **Leichtbau**: Light construction (steel frame, timber frame)

## 🔬 Acoustic Calculations

The UI provides interfaces for all major acoustic calculations:

### Sound Reduction (Rw)
- Mass law calculations for homogeneous elements
- Laboratory measurement input and validation
- Layer improvement calculations (ΔRw)
- Combined element calculations

### Flanking Transmission
- Complete flanking path analysis (Ff, Fd, Df, Dd)
- Junction attenuation (Kij) calculations
- T-joint and X-joint configurations
- Elastic junction improvements

### Impact Sound (Lnw)
- Basic floor impact sound calculations
- Floating floor improvements
- Ceiling system contributions
- Combined weighted impact sound levels

### Results Processing
- Energetic addition of transmission paths
- Spectrum weighting and single-number ratings
- Standards compliance checking
- Uncertainty analysis and validation

## 📊 Standards Implementation

### DIN 4109 (German Standard)
- Minimum requirements for sound insulation
- Calculation procedures for prediction methods
- Junction attenuation values and improvements
- Impact sound requirements and verification

### ISO 12354 (International Standard)
- Prediction methods for building acoustics
- Flanking transmission calculation procedures
- Statistical energy analysis implementation
- Laboratory to in-situ conversion factors

## 🎨 Design System

### Acoustic Theme
The application uses a custom Tailwind CSS theme optimized for acoustic professionals:

- **Primary Colors**: Deep blues representing sound waves
- **Secondary Colors**: Warm oranges for highlights and CTAs
- **Neutral Palette**: Clean grays for professional appearance
- **Success/Warning/Error**: Clear status indication for calculations

### Responsive Breakpoints
- **Mobile**: 640px and below - Essential functionality
- **Tablet**: 768px - 1023px - Optimized forms and navigation
- **Desktop**: 1024px and above - Full feature set

## 🚀 Deployment

### GitHub Pages
The application is optimized for GitHub Pages deployment:

1. Build process generates static assets in `dist/`
2. GitHub Actions workflow handles automatic deployment
3. Base URL configuration for subdirectory hosting
4. Optimized bundle splitting for fast loading

### Production Build
```bash
npm run build
```

Creates optimized production build with:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Asset optimization and compression
- Source maps for debugging

## 🔧 Configuration

### Environment Variables
- `VITE_BASE_URL` - Base URL for deployment (GitHub Pages)
- `VITE_API_URL` - API endpoint (if backend integration)
- `VITE_ANALYTICS_ID` - Analytics tracking ID

### Vite Configuration
The `vite.config.ts` includes:
- React plugin with fast refresh
- TypeScript support with path mapping
- Tailwind CSS processing
- Asset optimization
- Development server configuration

## 🧪 Testing

### Testing Strategy
- Component testing with React Testing Library
- Form validation testing
- Calculation result verification
- Accessibility testing
- Cross-browser compatibility

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with TypeScript strict mode
3. Add tests for new functionality
4. Run linting and type checking
5. Test in development and preview modes
6. Submit pull request with clear description

### Code Standards
- TypeScript strict mode required
- ESLint configuration for code quality
- Prettier for consistent formatting
- Semantic commit messages
- Component documentation with JSDoc

## 📄 License

MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🔗 Related Packages

- [@vbacoustic/lib](../lib/README.md) - Core acoustic calculation library
- [Monorepo Root](../../README.md) - Overall project documentation
