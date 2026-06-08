import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ['subbly-production-builder.nyc3.cdn.digitaloceanspaces.com', 'h2-awake.de'],
  },
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

