import React from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/home/AnimatedBackground';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatSection';
import { FeaturesSection } from '@/components/home/FeatureSection';
import { HowItWorksSection } from '@/components/home/HowItWorkSection';
import { PricingSection } from '@/components/home/PricingSection';
import { CTASection } from '@/components/home/CTASection';
import { Footer } from '@/components/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}