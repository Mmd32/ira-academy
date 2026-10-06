/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is native, so it must stay a real require on the server
  // rather than being bundled into the server chunks. (Next 15 renames this
  // to the top-level serverExternalPackages.)
  experimental: { serverComponentsExternalPackages: ['better-sqlite3'] },
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
