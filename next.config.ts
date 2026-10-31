import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const config: NextConfig = {
  output: "export",
  basePath,
  poweredByHeader: false,
};

export default config;
