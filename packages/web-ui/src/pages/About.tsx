const About = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="prose prose-lg max-w-7xl">
        <h1 className="pt-6 mb-0">About VBAcoustic</h1>

        <p className="mt-0">
          VBAcoustic is a professional building acoustic calculation tool designed for architects, 
          engineers, and acoustic consultants. The application provides comprehensive acoustic 
          analysis according to German and international standards.
        </p>

        <h2 className="pt-6 mb-0">Supported Standards</h2>
        <ul className="mt-0">
          <li><strong>DIN 4109</strong> - German standard for sound insulation in buildings</li>
          <li><strong>ISO 12354</strong> - International standard for acoustic calculations</li>
        </ul>

        <h2 className="pt-6 mb-0">Technical Implementation</h2>
        <p className="mt-0">
          This web application is built using modern web technologies and implements the same 
          calculation algorithms as the original VBA implementation. The calculations are 
          performed client-side using TypeScript for accuracy and performance.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
          <h3 className="text-blue-900 font-semibold mb-0">Getting Started</h3>
          <p className="text-blue-800 mt-0">
            To begin using the calculator, navigate to the Calculator page and follow the 
            step-by-step wizard to input your building element properties and calculation parameters.
          </p>
        </div>
        </div>
      </div>
      
  );
};

export default About;
