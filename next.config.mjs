/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add resolver for .mjs files
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts', '.mtsx']
    }
    return config
  },
    reactStrictMode: false,
    transpilePackages: ['jotai-devtools'],
    images: {
        domains: ['hnqqxpwdrdlvuzccxola.supabase.co', 'res.cloudinary.com']
      }
};

export default nextConfig;
