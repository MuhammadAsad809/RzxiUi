export type ControlName = "color" | "intensity" | "speed";
export type ComponentMeta = {
  slug: string;
  name: string;
  category: "UI" | "3D" | "Motion" | "Backgrounds";
  description: string;
  exportName: string;
  importFrom?: string;
  controls: ControlName[];
  colorProp?: "color" | "tint" | "colors";
  badge?: string;
};

export const components: ComponentMeta[] = [
  { slug: "liquid-orb", name: "LiquidOrb", category: "3D", description: "A refractive glass sphere with slow, pointer-free motion and a deliberately light Canvas setup.", exportName: "LiquidOrb", importFrom: "@rzxiui/react/three", controls: ["color", "intensity", "speed"], colorProp: "color", badge: "3D" },
  { slug: "floating-object", name: "FloatingObject", category: "3D", description: "A small floating mesh with selectable geometry, clearcoat, and configurable material response.", exportName: "FloatingObject", importFrom: "@rzxiui/react/three", controls: ["color", "intensity", "speed"], colorProp: "color", badge: "3D" },
  { slug: "morphing-shape", name: "MorphingShape", category: "3D", description: "A superellipsoid that smoothly shifts between sphere, cube, and diamond profiles.", exportName: "MorphingShape", importFrom: "@rzxiui/react/three", controls: ["color", "intensity", "speed"], colorProp: "color", badge: "3D" },
  { slug: "3d-card", name: "ThreeDCard", category: "UI", description: "A semantic card with pointer-based perspective, depth, and a restrained light response.", exportName: "ThreeDCard", controls: ["color", "intensity"], colorProp: "color" },
  { slug: "holographic-card", name: "HolographicCard", category: "UI", description: "A translucent card that shifts its iridescent reflection toward the pointer.", exportName: "HolographicCard", controls: ["color", "intensity"], colorProp: "color" },
  { slug: "liquid-button", name: "LiquidButton", category: "UI", description: "A keyboard-friendly button with a fluid highlight and adjustable accent color.", exportName: "LiquidButton", controls: ["color", "intensity", "speed"], colorProp: "color" },
  { slug: "3d-navigation", name: "ThreeDNavigation", category: "UI", description: "An adaptive pill navigation with a subtle lifted active state and semantic links.", exportName: "ThreeDNavigation", controls: [] },
  { slug: "glass-panel", name: "GlassPanel", category: "UI", description: "A layered glass surface with controllable tint, border, blur, and inset reflection.", exportName: "GlassPanel", controls: ["color", "intensity"], colorProp: "tint" },
  { slug: "particle-field", name: "ParticleField", category: "Backgrounds", description: "A bounded canvas particle field that pauses outside the viewport and caps device pixel ratio.", exportName: "ParticleField", controls: ["color", "speed"], colorProp: "color" },
  { slug: "animated-background", name: "AnimatedBackground", category: "Backgrounds", description: "A CSS-only ambient background with a soft, slow-moving light field and reduced-motion support.", exportName: "AnimatedBackground", controls: ["intensity", "speed"] },
  { slug: "text-reveal", name: "TextReveal", category: "Motion", description: "A compact intersection-triggered reveal with a reduced-motion and no-observer fallback.", exportName: "TextReveal", controls: [] },
  { slug: "magnetic-element", name: "MagneticElement", category: "Motion", description: "A gentle pointer attraction effect that stays off on touch devices and for reduced motion.", exportName: "MagneticElement", controls: [] },
  { slug: "morphing-loader", name: "MorphingLoader", category: "Motion", description: "A labelled, CSS-only organic loader with a compact footprint and motion preference support.", exportName: "MorphingLoader", controls: ["color"], colorProp: "color" },
  { slug: "spotlight-card", name: "SpotlightCard", category: "UI", description: "A pointer-following radial highlight with a low-contrast, responsive border glow.", exportName: "SpotlightCard", controls: ["color", "intensity"], colorProp: "color" },
  { slug: "scroll-scene", name: "ScrollScene", category: "Motion", description: "An intersection-aware entrance scene driven by GSAP and cleaned up when it unmounts.", exportName: "ScrollScene", controls: [] },
  { slug: "gradient-mesh", name: "GradientMesh", category: "Backgrounds", description: "A layered CSS mesh with configurable palette, intensity, and drift speed.", exportName: "GradientMesh", controls: ["color", "intensity", "speed"], colorProp: "colors" },
  { slug: "glass-modal", name: "GlassModal", category: "UI", description: "A native dialog with focus management, Escape handling, backdrop blur, and a glass surface.", exportName: "GlassModal", controls: [] },
  { slug: "depth-button", name: "DepthButton", category: "UI", description: "A tactile press-and-release button with a visible keyboard focus state.", exportName: "DepthButton", controls: ["color"], colorProp: "color" },
];

export const categories = [
  { label: "Components", href: "/components", count: components.length, note: "The full component set" },
  { label: "3D Components", href: "/3d", count: components.filter((item) => item.category === "3D").length, note: "WebGL where it earns the cost" },
  { label: "Animations", href: "/animations", count: components.filter((item) => item.category === "Motion").length, note: "Motion with reduced-motion support" },
  { label: "Backgrounds", href: "/backgrounds", count: components.filter((item) => item.category === "Backgrounds").length, note: "Canvas and CSS effects" },
];

export const bySlug = (slug?: string) => components.find((item) => item.slug === slug);
