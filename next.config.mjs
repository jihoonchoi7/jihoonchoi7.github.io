/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/jihoon-website' : '',
    images: {
        unoptimized: true,
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

export default nextConfig;
