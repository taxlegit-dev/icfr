import React from 'react';
import { Sparkles, Zap, FileText, Download, Shield, Globe } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description: "Transform your business processes into comprehensive SOPs in minutes using advanced AI technology"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Generate multiple processes in parallel. What takes weeks manually, now happens in minutes"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comprehensive Coverage",
      description: "From processes to subprocesses, tasks, steps, risks and mitigations - everything documented"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export Ready",
      description: "Download your SOPs in PDF and editable Excel formats with professional watermarking"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Every step comes with identified risks and proven mitigation strategies"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Industry Agnostic",
      description: "Works for manufacturing, service, trading - any industry, any business model"
    }
  ];

  return (
    <section id="features" className="relative z-10 py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Modern Teams</span>
          </h2>
          <p className="text-xl text-gray-400">Everything you need to streamline your documentation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition hover:scale-105 transform"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <div className="text-purple-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};