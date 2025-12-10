import React from 'react';
import { Brain, TrendingUp, Lightbulb } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "Top Mindset Shift",
      description: "Uncover the crucial mental adjustments needed to overcome current challenges and unlock new growth."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Top Operational Focus",
      description: "Identify the single most impactful operational area to streamline for immediate improvements."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      title: "One Recommended Next Move",
      description: "Receive a clear, actionable step you can take right now to move your company forward."
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          What You'll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;