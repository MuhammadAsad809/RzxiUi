import React, { lazy, Suspense, useState } from "react";
import {
  AnimatedBackground,
  DepthButton,
  GlassModal,
  GlassPanel,
  GradientMesh,
  HolographicCard,
  LiquidButton,
  MagneticElement,
  MorphingLoader,
  ParticleField,
  ScrollScene,
  SpotlightCard,
  TextReveal,
  ThreeDCard,
  ThreeDNavigation,
} from "@rzxiui/react";
import type { FloatingGeometry, MorphShape } from "@rzxiui/react/three";
import type { ComponentMeta, ControlName } from "./data.js";

const ScenePreview = lazy(async () => {
  const three = await import("@rzxiui/react/three");
  const PreviewScene = ({
    slug,
    color,
    intensity,
    speed,
    floatingShape,
    morphShape,
  }: {
    slug: string;
    color: string;
    intensity: number;
    speed: number;
    floatingShape: FloatingGeometry;
    morphShape: MorphShape;
  }) => {
    if (slug === "liquid-orb")
      return (
        <three.LiquidOrb
          color={color}
          intensity={intensity}
          speed={speed}
          height={320}
        />
      );
    if (slug === "floating-object")
      return (
        <three.FloatingObject
          color={color}
          intensity={intensity}
          speed={speed}
          shape={floatingShape}
          height={320}
        />
      );
    return (
      <three.MorphingShape
        color={color}
        intensity={intensity}
        speed={speed}
        shape={morphShape}
        height={320}
      />
    );
  };
  return { default: PreviewScene };
});

const defaultColor = "#38bdf8";

const materialSwatches = [
  { name: "Sky", hex: "#38bdf8" },
  { name: "Platinum", hex: "#e2e8f0" },
  { name: "Indigo", hex: "#818cf8" },
  { name: "Emerald", hex: "#34d399" },
  { name: "Amber", hex: "#f59e0b" },
];

function ModalDemo({ color }: { color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="preview-interactive-stack">
      <LiquidButton color={color} onClick={() => setOpen(true)}>
        Open Glass Modal
      </LiquidButton>
      <span className="preview-helper-note">
        Uses native HTML dialog with Escape key &amp; backdrop dismissal
      </span>
      <GlassModal
        open={open}
        onOpenChange={setOpen}
        title="Workspace Environment Configuration"
      >
        <p>
          Built on the native browser dialog element with automatic focus
          trapping, keyboard dismissal, and hardware-accelerated backdrop
          filtering.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <LiquidButton color={color} onClick={() => setOpen(false)}>
            Confirm Changes
          </LiquidButton>
        </div>
      </GlassModal>
    </div>
  );
}

function Preview({
  meta,
  color,
  intensity,
  speed,
  floatingShape,
  morphShape,
  replayKey,
  onReplay,
}: {
  meta: ComponentMeta;
  color: string;
  intensity: number;
  speed: number;
  floatingShape: FloatingGeometry;
  morphShape: MorphShape;
  replayKey: number;
  onReplay: () => void;
}) {
  const [activeNav, setActiveNav] = useState("Architecture");
  const [pressCount, setPressCount] = useState(0);

  if (meta.category === "3D") {
    return (
      <Suspense
        fallback={
          <div className="scene-loading">
            <MorphingLoader color={color} size={40} label="Loading 3D scene" />
            <span>Initializing Three.js viewport…</span>
          </div>
        }
      >
        <ScenePreview
          slug={meta.slug}
          color={color}
          intensity={intensity}
          speed={speed}
          floatingShape={floatingShape}
          morphShape={morphShape}
        />
      </Suspense>
    );
  }

  switch (meta.slug) {
    case "liquid-button":
      return (
        <div className="preview-interactive-stack">
          <LiquidButton
            color={color}
            intensity={intensity}
            speed={speed}
            onClick={() => setPressCount((c) => c + 1)}
          >
            Deploy Production Build
          </LiquidButton>
          <span className="preview-helper-note">
            Triggered {pressCount} {pressCount === 1 ? "time" : "times"} · Hover
            to inspect specular sweep
          </span>
        </div>
      );
    case "depth-button":
      return (
        <div className="preview-interactive-stack">
          <DepthButton
            color={color}
            onClick={() => setPressCount((c) => c + 1)}
          >
            Commit Release
          </DepthButton>
          <span className="preview-helper-note">
            Tactile elevation press · Activated {pressCount}{" "}
            {pressCount === 1 ? "time" : "times"}
          </span>
        </div>
      );
    case "glass-panel":
      return (
        <GlassPanel
          tint={color}
          intensity={intensity}
          style={{ minHeight: 140, padding: 28 }}
        >
          <span className="preview-kicker">Optical Surface · Layer 01</span>
          <h3>Refractive clarity without visual noise.</h3>
          <p>
            Calibrated saturation and hairline specular borders keep body copy
            effortlessly legible across high-contrast backgrounds.
          </p>
        </GlassPanel>
      );
    case "holographic-card":
      return (
        <HolographicCard
          color={color}
          intensity={intensity}
          style={{ minHeight: 140, padding: 28 }}
        >
          <span className="preview-kicker">Iridescent Foil Response</span>
          <h3>Chromatic pointer tracking.</h3>
          <p>
            Move your cursor across the surface to shift the dual-layer screen
            reflection and radial accent field.
          </p>
        </HolographicCard>
      );
    case "spotlight-card":
      return (
        <SpotlightCard
          color={color}
          intensity={intensity}
          style={{ minHeight: 140, padding: 28 }}
        >
          <span className="preview-kicker">Radial Illumination</span>
          <h3>Focused cursor-bound lighting.</h3>
          <p>
            Tracks pointer coordinates via CSS custom properties with zero React
            re-renders during movement.
          </p>
        </SpotlightCard>
      );
    case "3d-card":
      return (
        <ThreeDCard
          color={color}
          intensity={intensity}
          style={{ minHeight: 140, padding: 28 }}
        >
          <span className="preview-kicker">Perspective Transform</span>
          <h3>Hardware-accelerated 3D tilt.</h3>
          <p>
            Calculates pitch and yaw angles relative to card center while
            preserving crisp subpixel text rendering.
          </p>
        </ThreeDCard>
      );
    case "3d-navigation":
      return (
        <div className="preview-interactive-stack">
          <ThreeDNavigation
            items={[
              {
                label: "Architecture",
                href: "#architecture",
                value: "Architecture",
              },
              { label: "Primitives", href: "#primitives", value: "Primitives" },
              { label: "Shaders", href: "#shaders", value: "Shaders" },
              { label: "Telemetry", href: "#telemetry", value: "Telemetry" },
            ]}
            current={activeNav}
            onSelect={(item) => setActiveNav(item.value ?? item.label)}
          />
          <span className="preview-helper-note">
            Active route: {activeNav} · Click items to test elevation state
          </span>
        </div>
      );
    case "particle-field":
      return (
        <div className="preview-particles">
          <ParticleField color={color} speed={speed} density={46} />
        </div>
      );
    case "animated-background":
      return (
        <AnimatedBackground
          intensity={intensity}
          speed={speed}
          className="preview-ambient"
        >
          <div className="preview-ambient-copy">
            <span className="preview-kicker">Atmospheric Layer</span>
            <strong>Continuous low-frequency ambient drift.</strong>
          </div>
        </AnimatedBackground>
      );
    case "text-reveal":
      return (
        <div className="preview-text" key={replayKey}>
          <TextReveal delay={80}>
            <strong>Typography that enters with measured composure.</strong>
          </TextReveal>
          <div className="preview-replay-row">
            <span>IntersectionObserver entrance transition</span>
            <button
              type="button"
              className="replay-trigger-btn"
              onClick={onReplay}
            >
              Replay entrance
            </button>
          </div>
        </div>
      );
    case "magnetic-element":
      return (
        <div className="preview-magnetic">
          <MagneticElement strength={14}>
            <LiquidButton color={color}>
              Move cursor near button boundary
            </LiquidButton>
          </MagneticElement>
        </div>
      );
    case "morphing-loader":
      return (
        <div className="preview-loader">
          <MorphingLoader color={color} size={56} label="Preview loading" />
          <span>Accessible status indicator · CSS organic keyframes</span>
        </div>
      );
    case "scroll-scene":
      return (
        <div className="preview-interactive-stack" key={replayKey}>
          <ScrollScene className="preview-scroll">
            <span className="preview-kicker">GSAP Scroll Scene</span>
            <h3>Viewport-triggered entrance choreography.</h3>
            <p>
              Automatically disposes tweens on unmount and bypasses motion when
              prefers-reduced-motion is enabled.
            </p>
          </ScrollScene>
          <button
            type="button"
            className="replay-trigger-btn"
            onClick={onReplay}
          >
            Replay tween
          </button>
        </div>
      );
    case "gradient-mesh":
      return (
        <GradientMesh
          colors={[color, "#312e81", "#0f766e"]}
          intensity={intensity}
          speed={Math.max(8, 24 / Math.max(0.35, speed))}
          className="preview-mesh"
        >
          <span className="preview-kicker">Multi-Stop Mesh Field</span>
          <h3>Three-point diffused color blending.</h3>
        </GradientMesh>
      );
    case "glass-modal":
      return <ModalDemo color={color} />;
    default:
      return (
        <GlassPanel style={{ padding: 28 }}>Live component preview</GlassPanel>
      );
  }
}

function snippet(
  meta: ComponentMeta,
  color: string,
  intensity: number,
  speed: number,
  floatingShape: FloatingGeometry,
  morphShape: MorphShape
) {
  const props: string[] = [];
  if (meta.controls.includes("color")) {
    if (meta.colorProp === "tint") props.push(`tint="${color}"`);
    else if (meta.colorProp === "colors")
      props.push(`colors={["${color}", "#312e81", "#0f766e"]}`);
    else props.push(`color="${color}"`);
  }
  if (meta.controls.includes("intensity"))
    props.push(`intensity={${intensity.toFixed(2)}}`);
  if (meta.controls.includes("speed"))
    props.push(`speed={${speed.toFixed(2)}}`);
  if (meta.slug === "floating-object") props.push(`shape="${floatingShape}"`);
  if (meta.slug === "morphing-shape") props.push(`shape="${morphShape}"`);
  const source = meta.importFrom ?? "@rzxiui/react";
  return `import { ${meta.exportName} } from "${source}";\n\nexport function Example() {\n  return <${meta.exportName}${props.length ? " " + props.join(" ") : ""} />;\n}\n`;
}

export default function Playground({ meta }: { meta: ComponentMeta }) {
  const [color, setColor] = useState(defaultColor);
  const [intensity, setIntensity] = useState(0.76);
  const [speed, setSpeed] = useState(1);
  const [floatingShape, setFloatingShape] =
    useState<FloatingGeometry>("knot");
  const [morphShape, setMorphShape] = useState<MorphShape>("cube");
  const [replayKey, setReplayKey] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<"wide" | "phone">("wide");
  const [copied, setCopied] = useState(false);

  const code = snippet(
    meta,
    color,
    intensity,
    speed,
    floatingShape,
    morphShape
  );
  const updateControl = (name: ControlName, value: number) =>
    name === "intensity" ? setIntensity(value) : setSpeed(value);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const resetAll = () => {
    setColor(defaultColor);
    setIntensity(0.76);
    setSpeed(1);
    setFloatingShape("knot");
    setMorphShape("cube");
    setViewport("wide");
    setTab("preview");
    setReplayKey((k) => k + 1);
  };

  return (
    <section className="playground" aria-label={meta.name + " playground"}>
      <div className="playground-toolbar">
        <div
          className="playground-tabs"
          role="tablist"
          aria-label="Preview or source"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            className={tab === "preview" ? "selected" : ""}
            onClick={() => setTab("preview")}
          >
            Interactive Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "code"}
            className={tab === "code" ? "selected" : ""}
            onClick={() => setTab("code")}
          >
            JSX Source
          </button>
        </div>
        <div className="playground-actions">
          <button
            type="button"
            className={viewport === "wide" ? "selected" : ""}
            onClick={() => setViewport("wide")}
            aria-label="Desktop viewport"
          >
            Desktop
          </button>
          <button
            type="button"
            className={viewport === "phone" ? "selected" : ""}
            onClick={() => setViewport("phone")}
            aria-label="Mobile viewport"
          >
            Mobile (375px)
          </button>
          <button type="button" onClick={resetAll}>
            Reset
          </button>
        </div>
      </div>

      <div className="playground-body">
        <div className="playground-stage-wrap">
          <div
            className={
              "playground-stage " + (viewport === "phone" ? "phone-stage" : "")
            }
          >
            {tab === "preview" ? (
              <Preview
                meta={meta}
                color={color}
                intensity={intensity}
                speed={speed}
                floatingShape={floatingShape}
                morphShape={morphShape}
                replayKey={replayKey}
                onReplay={() => setReplayKey((k) => k + 1)}
              />
            ) : (
              <pre className="playground-code">
                <code>{code}</code>
              </pre>
            )}
          </div>
          <div className="stage-caption">
            <span>Live React Instance · {meta.exportName}</span>
            <span>{meta.importFrom ?? "@rzxiui/react"}</span>
          </div>
        </div>

        <aside className="control-panel" aria-label="Component controls">
          <div className="control-title">
            <span>Parameters</span>
            <span>Live Props</span>
          </div>

          {meta.controls.includes("color") && (
            <div className="control-group">
              <label className="control-row">
                <span>Accent Color</span>
                <input
                  aria-label="Component color"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </label>
              <div className="swatch-row" role="group" aria-label="Color presets">
                {materialSwatches.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    className={
                      "swatch-btn " +
                      (color.toLowerCase() === swatch.hex ? "active" : "")
                    }
                    style={{ "--swatch-color": swatch.hex } as React.CSSProperties}
                    onClick={() => setColor(swatch.hex)}
                    title={swatch.name}
                    aria-label={swatch.name}
                  />
                ))}
              </div>
            </div>
          )}

          {meta.slug === "floating-object" && (
            <div className="control-group">
              <span className="control-label">Mesh Geometry</span>
              <div className="shape-selector">
                {(
                  [
                    "knot",
                    "icosahedron",
                    "torus",
                    "sphere",
                    "box",
                  ] as FloatingGeometry[]
                ).map((shapeOption) => (
                  <button
                    key={shapeOption}
                    type="button"
                    className={floatingShape === shapeOption ? "active" : ""}
                    onClick={() => setFloatingShape(shapeOption)}
                  >
                    {shapeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.slug === "morphing-shape" && (
            <div className="control-group">
              <span className="control-label">Superellipsoid Profile</span>
              <div className="shape-selector">
                {(["cube", "sphere", "diamond"] as MorphShape[]).map(
                  (shapeOption) => (
                    <button
                      key={shapeOption}
                      type="button"
                      className={morphShape === shapeOption ? "active" : ""}
                      onClick={() => setMorphShape(shapeOption)}
                    >
                      {shapeOption}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {meta.controls.includes("intensity") && (
            <label className="control-row control-range">
              <span>
                Intensity <output>{intensity.toFixed(2)}</output>
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={intensity}
                onChange={(event) =>
                  updateControl("intensity", Number(event.target.value))
                }
              />
            </label>
          )}

          {meta.controls.includes("speed") && (
            <label className="control-row control-range">
              <span>
                Speed <output>{speed.toFixed(2)}×</output>
              </span>
              <input
                type="range"
                min="0.35"
                max="1.8"
                step="0.05"
                value={speed}
                onChange={(event) =>
                  updateControl("speed", Number(event.target.value))
                }
              />
            </label>
          )}

          <p className="control-note">
            Adjusts live React props on the mounted component. WebGL canvases
            automatically pause when scrolled out of view.
          </p>

          <button type="button" className="copy-code" onClick={copy}>
            <span>{copied ? "Copied to clipboard" : "Copy JSX snippet"}</span>
            <span className="copy-shortcut" aria-hidden="true">
              {copied ? "✓" : "Copy"}
            </span>
          </button>
        </aside>
      </div>
    </section>
  );
}

