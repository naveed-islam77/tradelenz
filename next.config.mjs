import { codeInspectorPlugin } from 'code-inspector-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   webpack: (config) => {
     config.plugins?.push(codeInspectorPlugin({
      bundler: "webpack",
      editor: "code",
      hotKeys: ["ctrlKey"]
    }));
    return config;
  },
};

export default nextConfig;
