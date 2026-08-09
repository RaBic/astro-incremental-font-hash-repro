# Astro incremental font dependency-hash reproduction

This minimal project demonstrates that Astro 7.2.0 does not restore an unchanged dynamic page from the experimental incremental-build cache when the page renders Astro's `<Font>` component.

## Reproduce

Tested with Node.js 24.19.0 and npm.

```sh
npm install
npm run reproduce
```

The script clears only generated `dist/` and `node_modules/.astro/` state, performs two builds without changing source files, and reads the page dependency hash after each build.

The bug is reproduced when the command prints:

```json
{
  "firstHash": "...",
  "secondHash": "...",
  "hashesMatch": false,
  "secondBuildRestored": false
}
```

Removing `<Font cssVariable="--font-primary" preload />` from `src/pages/[slug].astro` provides the stable control: both hashes match and the second build is restored.
