import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Documentation?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <button className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center space-x-2 mx-auto">
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </section>
  );
};