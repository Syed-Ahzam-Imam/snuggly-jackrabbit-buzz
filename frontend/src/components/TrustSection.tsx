import React from 'react';
import { Lock } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-blue-50">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Your Trust is Our Priority
          </h2>
        </div>
        <p className="text-lg text-gray-700">
          Your answers are private and confidential. We are committed to protecting your data and insights.
        </p>
      </div>
    </section>
  );
};

export default TrustSection;