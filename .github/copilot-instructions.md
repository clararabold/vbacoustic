# VBAcoustic Web UI - Copilot Instructions

This is a React TypeScript web application for building acoustic calculations. The UI integrates with a TypeScript acoustic calculation library.

## Project Structure
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling  
- React Router for navigation
- React Hook Form for form management
- Zustand for state management (to be added)

## Key Components
- Multi-step calculator wizard
- Form components for building element input
- Results display with charts
- Standards compliance checking

## Acoustic Domain
- Supports DIN 4109 and ISO 12354 standards
- Construction types: Massivbau, Massivholzbau, Leichtbau
- Calculations include flanking transmission analysis
- Element types: walls, floors, ceilings

## Development Guidelines
- Use TypeScript strict mode
- Follow React best practices
- Use Tailwind utility classes
- Implement proper form validation
- Create reusable components

## Integration Notes
- Will integrate with existing TypeScript acoustic library
- Forms should match the library's data structures
- Validation should use the library's validators
