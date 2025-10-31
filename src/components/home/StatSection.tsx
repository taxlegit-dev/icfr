import React from 'react';

export const StatsSection = () => {
  const stats = [
    { number: "10x", label: "Faster SOP Creation" },
    { number: "100%", label: "Customized Output" },
    { number: "50+", label: "Business Processes" },
    { number: "24/7", label: "Access Anytime" }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition hover:scale-105 transform">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};