import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

export default withPayload(nextConfig)
