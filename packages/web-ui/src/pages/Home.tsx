import { Link } from 'react-router-dom';
import { Calculator, Zap, Shield, BarChart3 } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Acoustic Calculations',
      description: 'Comprehensive building acoustic calculations according to DIN 4109 and ISO 12354 standards.'
    },
    {
      icon: Zap,
      title: 'Fast & Accurate',
      description: 'Optimized algorithms for quick and precise acoustic performance predictions.'
    },
    {
      icon: Shield,
      title: 'Standards Compliant',
      description: 'Full compliance with German and international building acoustic standards.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Results',
      description: 'Comprehensive reports with flanking transmission and frequency analysis.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Building Acoustic Calculator
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional acoustic calculation tool for walls, floors, and ceilings. 
              Based on DIN 4109 and ISO 12354 standards with flanking transmission analysis.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/calculator"
                className="btn-primary"
              >
                Start Calculation
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Professional Tools
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for acoustic calculations
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Comprehensive tool for building acoustic analysis with support for various construction types 
              including mass timber, lightweight, and solid construction.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
