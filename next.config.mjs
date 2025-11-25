// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },

//   output: 'export',
//   distDir: 'dist',
// }

// export default nextConfig

const isProd = process.env.NODE_ENV === 'production';
const repo = 'gestion-de-proyectos';

export default {
  output: 'export',              // genera /out automáticamente
  images: { unoptimized: true }, // evitar optimización en server
  // basePath: isProd ? `/${repo}` : '',
  // assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,
};