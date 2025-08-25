import { Link } from 'react-router-dom';
import { Calculator, Zap, Shield, BarChart3 } from 'lucide-react';

const Home = () => {
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
    </div>
  );
};

export default Home;
