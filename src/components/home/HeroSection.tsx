import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-8 animate-bounce">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-purple-200">AI-Powered SOP Generation Platform</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Your Business
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Processes Into SOPs
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Generate comprehensive Standard Operating Procedures in minutes, not weeks. 
          AI-powered, industry-specific, and ready to deploy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center space-x-2">
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition">
            Watch Demo
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Free Trial Progress</span>
            <span className="text-purple-400 font-semibold">1/3 SOPs Used</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full animate-pulse" style={{width: '33%'}}></div>
          </div>
          <p className="text-sm text-gray-400">Unlock 2 more SOPs for ₹499 • Trial expires in <span className="text-pink-400 font-semibold">48 hours</span></p>
        </div>
      </div>
    </section>
  );
};