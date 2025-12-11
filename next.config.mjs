/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false, // This hides the "N" static indicator
    buildActivity: false, // This hides the compiling lightning bolt
  },
};

export default nextConfig;