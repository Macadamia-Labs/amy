/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fgeeyklwaodzomhvnrll.supabase.co',
        pathname: '/storage/v1/object/**'
      }
    ]
  }
}

export default nextConfig
