import type { NextConfig } from "next";

// GitHub Pages 把這個 repo 部署在 /realestate-dad/ 這個子路徑下，
// 只有 GitHub Actions 的部署流程會設 GITHUB_PAGES=true，本機開發跟其他部署平台不受影響。
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/realestate-dad" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
