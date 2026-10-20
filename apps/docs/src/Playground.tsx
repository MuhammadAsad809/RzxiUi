import React, { lazy, Suspense, useState } from "react";
import { AnimatedBackground, DepthButton, GlassModal, GlassPanel, HolographicCard, LiquidButton, MagneticElement, MorphingLoader, ParticleField, ScrollScene, SpotlightCard, TextReveal, ThreeDCard, ThreeDNavigation, GradientMesh } from "@rzxiui/react";
import type { ComponentMeta, ControlName } from "./data.js";

const ScenePreview = lazy(async () => {
  const three = await import("@rzxiui/react/three");
  const Preview = ({ slug, color, intensity, speed }: { slug: string; color: string; intensity: number; speed: number }) => {
    if (slug === "liquid-orb") return <three.LiquidOrb color={color} intensity={intensity} speed={speed} />;
    if (slug === "floating-object") return <three.FloatingObject color={color} intensity={intensity} speed={speed} shape="knot" />;
    return <three.MorphingShape color={color} intensity={intensity} speed={speed} shape="cube" />;
  };
  return { default: Preview };
});

const defaultColor = "#a9f2d1";
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return <><LiquidButton onClick={() => setOpen(true)}>Open glass modal</LiquidButton><GlassModal open={open} onOpenChange={setOpen} title="A quieter kind of dialog"><p>Native dialog semantics, keyboard dismissal, and a focused surface.</p><LiquidButton onClick={() => setOpen(false)}>Close</LiquidButton></GlassModal></>;
}

function Preview({ meta, color, intensity, speed }: { meta: ComponentMeta; color: string; intensity: number; speed: number }) {
  const [active, setActive] = useState("Overview");
  const style = { minHeight: 100 };
  if (meta.category === "3D") return <Suspense fallback={<div className="scene-loading">Loading the optional 3D module…</div>}><ScenePreview slug={meta.slug} color={color} intensity={intensity} speed={speed} /></Suspense>;
  switch (meta.slug) {
    case "liquid-button": return <LiquidButton color={color} intensity={intensity} speed={speed}>Explore the surface <span aria-hidden="true">↗</span></LiquidButton>;
    case "depth-button": return <DepthButton color={color}>Press to explore</DepthButton>;
    case "glass-panel": return <GlassPanel tint={color} intensity={intensity} style={{ ...style, padding: 26 }}><span className="preview-kicker">LIQUID UI / 01</span><h3>Glass, with restraint.</h3><p>Readable surfaces. Soft reflections. No extra noise.</p></GlassPanel>;
    case "holographic-card": return <HolographicCard color={color} intensity={intensity} style={{ ...style, padding: 26 }}><span className="preview-kicker">SURFACE STUDY</span><h3>A little iridescence.</h3><p>Move your pointer across this card.</p></HolographicCard>;
    case "spotlight-card": return <SpotlightCard color={color} intensity={intensity} style={{ ...style, padding: 26 }}><span className="preview-kicker">POINTER RESPONSE</span><h3>Light follows you.</h3><p>A radial highlight, not a floodlight.</p></SpotlightCard>;
    case "3d-card": return <ThreeDCard color={color} intensity={intensity} style={{ ...style, padding: 26 }}><span className="preview-kicker">DEPTH STUDY</span><h3>Perspective, in CSS.</h3><p>Hover to tilt the surface.</p></ThreeDCard>;
    case "3d-navigation": return <ThreeDNavigation items={[{ label: "Overview", href: "#overview", value: "Overview" }, { label: "Components", href: "#components", value: "Components" }, { label: "Notes", href: "#notes", value: "Notes" }]} current={active} onSelect={(item) => setActive(item.value ?? item.label)} />;
    case "particle-field": return <div className="preview-particles"><ParticleField color={color} speed={speed} density={42} /></div>;
    case "animated-background": return <AnimatedBackground intensity={intensity} speed={speed} className="preview-ambient"><div className="preview-ambient-copy"><span className="preview-kicker">AMBIENT / 01</span><strong>Quiet movement.</strong></div></AnimatedBackground>;
    case "text-reveal": return <div className="preview-text"><TextReveal delay={120}><strong>Motion should feel considered.</strong></TextReveal><span>Scroll or reload to replay the entrance.</span></div>;
    case "magnetic-element": return <div className="preview-magnetic"><MagneticElement strength={13}><LiquidButton color={color}>Move gently toward me</LiquidButton></MagneticElement></div>;
    case "morphing-loader": return <div className="preview-loader"><MorphingLoader color={color} size={52} label="Preview loading" /><span>Loading components</span></div>;
    case "scroll-scene": return <ScrollScene className="preview-scroll"><span className="preview-kicker">SCROLL SCENE</span><h3>Reveal when it enters.</h3><p>GSAP tween, intersection-based trigger, automatic cleanup.</p></ScrollScene>;
    case "gradient-mesh": return <GradientMesh colors={[color, "#40365f", "#183a3a"]} intensity={intensity} speed={Math.max(8, 24 / Math.max(0.35, speed))} className="preview-mesh"><span className="preview-kicker">GRADIENT MESH</span><h3>Three colors. One soft field.</h3></GradientMesh>;
    case "glass-modal": return <ModalDemo />;
    default: return <GlassPanel style={{ padding: 24 }}>Live component preview</GlassPanel>;
  }
}

function snippet(meta: ComponentMeta, color: string, intensity: number, speed: number) {
  const props: string[] = [];
  if (meta.controls.includes("color")) {
    if (meta.colorProp === "tint") props.push("tint=\"" + color + "\"");
    else if (meta.colorProp === "colors") props.push("colors={[\"" + color + "\", \"#40365f\", \"#183a3a\"]}");
    else props.push("color=\"" + color + "\"");
  }
  if (meta.controls.includes("intensity")) props.push("intensity={" + intensity.toFixed(2) + "}");
  if (meta.controls.includes("speed")) props.push("speed={" + speed.toFixed(2) + "}");
  const source = meta.importFrom ?? "@rzxiui/react";
  return "import { " + meta.exportName + " } from \"" + source + "\";\n\nexport function Example() {\n  return <" + meta.exportName + (props.length ? " " + props.join(" ") : "") + " />;\n}\n";
}

export default function Playground({ meta }: { meta: ComponentMeta }) {
  const [color, setColor] = useState(defaultColor);
  const [intensity, setIntensity] = useState(0.72);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<"wide" | "phone">("wide");
  const [copied, setCopied] = useState(false);
  const code = snippet(meta, color, intensity, speed);
  const updateControl = (name: ControlName, value: number) => name === "intensity" ? setIntensity(value) : setSpeed(value);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1300); }
    catch { setCopied(false); }
  };
  return <section className="playground" aria-label={meta.name + " playground"}>
    <div className="playground-toolbar"><div className="playground-tabs" role="tablist" aria-label="Preview or source"><button type="button" role="tab" aria-selected={tab === "preview"} className={tab === "preview" ? "selected" : ""} onClick={() => setTab("preview")}>Preview</button><button type="button" role="tab" aria-selected={tab === "code"} className={tab === "code" ? "selected" : ""} onClick={() => setTab("code")}>Code</button></div><div className="playground-actions"><button type="button" className={viewport === "wide" ? "selected" : ""} onClick={() => setViewport("wide")} aria-label="Wide preview">Desktop</button><button type="button" className={viewport === "phone" ? "selected" : ""} onClick={() => setViewport("phone")} aria-label="Phone preview">Mobile</button><button type="button" onClick={() => { setColor(defaultColor); setIntensity(.72); setSpeed(1); setViewport("wide"); setTab("preview"); }}>Reset</button></div></div>
    <div className="playground-body">
      <div className="playground-stage-wrap"><div className={"playground-stage " + (viewport === "phone" ? "phone-stage" : "")}>
        {tab === "preview" ? <Preview meta={meta} color={color} intensity={intensity} speed={speed} /> : <pre className="playground-code"><code>{code}</code></pre>}
      </div><div className="stage-caption"><span>LIVE COMPONENT</span><span>React · TypeScript</span></div></div>
      <aside className="control-panel" aria-label="Component controls"><div className="control-title"><span>Controls</span><span>EDIT</span></div>
        {meta.controls.includes("color") && <label className="control-row"><span>Color</span><input aria-label="Component color" type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>}
        {meta.controls.includes("intensity") && <label className="control-row control-range"><span>Intensity <output>{intensity.toFixed(2)}</output></span><input type="range" min="0.1" max="1" step="0.01" value={intensity} onChange={(event) => updateControl("intensity", Number(event.target.value))} /></label>}
        {meta.controls.includes("speed") && <label className="control-row control-range"><span>Speed <output>{speed.toFixed(2)}×</output></span><input type="range" min="0.35" max="1.8" step="0.05" value={speed} onChange={(event) => updateControl("speed", Number(event.target.value))} /></label>}
        <div className="control-note">Updates the actual component props. 3D scenes load only when this preview is opened.</div><button type="button" className="copy-code" onClick={copy}>{copied ? "Copied" : "Copy example"}<span aria-hidden="true">⌘ C</span></button>
      </aside>
    </div>
  </section>;
}
