
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== "production",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  // Disable server-side rendering for most pages
  // This will make the site mostly client-side rendered
  // except for the API routes and any pages that explicitly use getServerSideProps
  pageExtensions: ["tsx", "ts"],
  serverRuntimeConfig: {
    // Uygulama içinde kullanabileceğiniz port numarası
    APP_PORT: process.env.PORT || 5555,
  },
}

export default nextConfig
