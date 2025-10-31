import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    { step: "01", title: "Answer Questions", desc: "Tell us about your company and industry" },
    { step: "02", title: "Select Processes", desc: "Choose which business processes to document" },
    { step: "03", title: "AI Generation", desc: "Our AI creates comprehensive SOPs instantly" },
    { step: "04", title: "Download & Deploy", desc: "Export in PDF/Excel and implement" }
  ];

  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400">Generate SOPs in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-purple-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
