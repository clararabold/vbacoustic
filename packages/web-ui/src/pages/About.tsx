const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="prose prose-lg max-w-none">
        <h1>About VBAcoustic</h1>
        
        <p>
          VBAcoustic is a professional building acoustic calculation tool designed for architects, 
          engineers, and acoustic consultants. The application provides comprehensive acoustic 
          analysis according to German and international standards.
        </p>

        <h2>Supported Standards</h2>
        <ul>
          <li><strong>DIN 4109</strong> - German standard for sound insulation in buildings</li>
          <li><strong>ISO 12354</strong> - International standard for acoustic calculations</li>
        </ul>

        <h2>Construction Types</h2>
        <p>The calculator supports various construction types:</p>
        
        <h3>Massivbau (Solid Construction)</h3>
        <ul>
          <li>Concrete walls and floors</li>
          <li>Masonry construction</li>
          <li>Reinforced concrete elements</li>
        </ul>

        <h3>Massivholzbau (Mass Timber Construction)</h3>
        <ul>
          <li>CLT (Cross Laminated Timber) panels</li>
          <li>Solid wood construction</li>
          <li>Timber-concrete composite floors</li>
        </ul>

        <h3>Leichtbau (Lightweight Construction)</h3>
        <ul>
          <li>Timber frame construction</li>
          <li>Metal stud walls</li>
          <li>Lightweight floor systems</li>
        </ul>

        <h2>Calculation Features</h2>
        <ul>
          <li>Airborne sound transmission calculations</li>
          <li>Impact sound transmission analysis</li>
          <li>Flanking transmission evaluation</li>
          <li>Frequency spectrum analysis</li>
          <li>Compliance checking</li>
        </ul>

        <h2>Technical Implementation</h2>
        <p>
          This web application is built using modern web technologies and implements the same 
          calculation algorithms as the original VBA implementation. The calculations are 
          performed client-side using TypeScript for accuracy and performance.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mt-8">
          <h3 className="text-blue-900 font-semibold mb-2">Getting Started</h3>
          <p className="text-blue-800">
            To begin using the calculator, navigate to the Calculator page and follow the 
            step-by-step wizard to input your building element properties and calculation parameters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
