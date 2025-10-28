import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true, // ✅ correct placement
  },
  // Turbopack disable karne ke liye kuch nahi karna - by default off hai
};

export default nextConfig;
