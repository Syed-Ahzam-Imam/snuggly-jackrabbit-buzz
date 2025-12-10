import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TrustSection from '../components/TrustSection';
import Footer from '../components/Footer';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <main className="flex-grow">
        <FeaturesSection />
        <TrustSection />
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Index;