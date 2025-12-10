import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // Import Link

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32 text-center overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
          Get Instant Clarity on What’s Holding Your Company Back
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          A 10-minute diagnostic for founders at growth inflection points.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/onboarding"> {/* Use Link for navigation */}
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              Start the Diagnostic
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            Learn More
          </Button>
        </div>
      </div>
      {/* Minimalistic background shapes for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-64 h-64 bg-blue-200 rounded-full opacity-20 -top-16 -left-16 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-indigo-200 rounded-full opacity-15 -bottom-32 -right-32 animate-pulse-slow delay-500"></div>
      </div>
    </section>
  );
};

export default HeroSection;