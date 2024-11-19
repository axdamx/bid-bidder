/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ['jotai-devtools'],
    images: {
        domains: ['hnqqxpwdrdlvuzccxola.supabase.co']
      }
};

export default nextConfig;
