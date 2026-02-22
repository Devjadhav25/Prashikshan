/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 's.gravatar.com' },
      { protocol: 'https', hostname: 'cdn.auth0.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'logo.clearbit.com' }, // ✅ Added for Hackathon Mock Data
      { 
        // ✅ RECOMMENDED FOR JOB BOARDS:
        // This allows logos from ANY random company website the API returns
        protocol: 'https', 
        hostname: '**' 
      },
      { 
        protocol: 'http', 
        hostname: '**' 
      }
    ],
  },
};

export default nextConfig;