import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  experimental: {
    incrementalBuild: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Roboto",
      cssVariable: "--font-primary",
      options: {
        variants: [
          {
            src: [
              "./node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff2",
            ],
            weight: "400",
            style: "normal",
          },
        ],
      },
    },
  ],
});
