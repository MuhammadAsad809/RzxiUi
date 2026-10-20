# Liquid UI

A React component library for liquid-glass surfaces, expressive motion, and focused 3D accents. This repository is a pnpm monorepo; the existing native package remains separate from the browser-first React library.

## Workspace

- apps/docs — Vite documentation site and interactive component playground
- packages/react — tree-shakeable React components; 3D components are isolated at @rzxiui/react/three
- packages/tokens — shared design tokens
- packages/native — existing React Native package scaffold, preserved

## Development

Use Node.js 20 or later and pnpm 10.

    pnpm install
    pnpm dev
    pnpm build
    pnpm typecheck

## Components

    import { GlassPanel, LiquidButton } from "@rzxiui/react";
    import "@rzxiui/react/styles.css";

    export function Welcome() {
      return (
        <GlassPanel>
          <h2>Made for depth</h2>
          <LiquidButton>Explore</LiquidButton>
        </GlassPanel>
      );
    }

3D scenes are an optional entry point and require React Three Fiber, Drei, and Three.js:

    import { LiquidOrb } from "@rzxiui/react/three";

    export function Hero() {
      return <LiquidOrb color="#c9fff0" intensity={0.8} speed={1} />;
    }

The packages are configured for npm publication but have not been published. Until a release is made, use the workspace packages or install directly from the repository.

## Accessibility and performance

Components expose semantic HTML, keyboard focus styles, reduced-motion fallbacks, and pointer interactions that avoid touch-only dependence. 3D canvases cap device pixel ratio, pause when off-screen, and show a fallback when WebGL is unavailable. Keep the 3D subpath optional in apps that do not need it.

## License

MIT. See LICENSE.
