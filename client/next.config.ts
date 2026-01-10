import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com', // ✅ Fixes the current error
      },
      {
        protocol: 'https',
        hostname: 'cdn.auth0.com',   // ✅ For Auth0 default avatars
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ For Google login avatars
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // ✅ Common for API logos
      },
      {
        protocol: 'https',
        hostname: 'jsearch.p.rapidapi.com', // ✅ For JSearch job logos
      }
    ],
  },
};




export default nextConfig;
