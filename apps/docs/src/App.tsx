import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  AnimatedBackground,
  DepthButton,
  GlassPanel,
  LiquidButton,
  MagneticElement,
  MorphingLoader,
  ParticleField,
  SpotlightCard,
  ThreeDCard,
} from "@rzxiui/react";
import { bySlug, categories, components } from "./data.js";
import Playground from "./Playground.js";

const HeroStudioScene = lazy(async () => {
  const three = await import("@rzxiui/react/three");
  const Studio = ({
    mode,
    color,
  }: {
    mode: "orb" | "knot" | "morph";
    color: string;
  }) => {
    if (mode === "knot") {
      return (
        <three.FloatingObject
          color={color}
          intensity={0.85}
          speed={0.9}
          shape="knot"
          height={420}
        />
      );
    }
    if (mode === "morph") {
      return (
        <three.MorphingShape
          color={color}
          intensity={0.85}
          speed={0.9}
          shape="diamond"
          height={420}
        />
      );
    }
    return (
      <three.LiquidOrb
        color={color}
        intensity={0.85}
        speed={0.82}
        height={420}
      />
    );
  };
  return { default: Studio };
});

const repoUrl = "https://github.com/MuhammadAsad809/RzxiUi";

const navGroups = [
  {
    title: "Foundations",
    links: [
      { label: "Overview", href: "/" },
      { label: "Installation", href: "/installation" },
      { label: "Getting started", href: "/getting-started" },
    ],
  },
  {
    title: "Catalog",
    links: [
      { label: "All components", href: "/components" },
      { label: "3D WebGL", href: "/3d" },
      { label: "Motion primitives", href: "/animations" },
      { label: "Background fields", href: "/backgrounds" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "API & props", href: "/api" },
      { label: "Composed patterns", href: "/examples" },
    ],
  },
];

function Sidebar() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.key === "/" &&
        target?.tagName !== "INPUT" &&
        target?.tagName !== "TEXTAREA" &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(
    () =>
      components.filter(
        (component) =>
          component.name.toLowerCase().includes(query.toLowerCase()) ||
          component.category.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <aside className="sidebar" aria-label="Component directory">
      <label className="search-box">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter 18 components…"
          aria-label="Filter components"
        />
        <kbd>/</kbd>
      </label>

      {navGroups.map((group) => (
        <div className="nav-group" key={group.title}>
          <span className="nav-group-title">{group.title}</span>
          {group.links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                "sidebar-link " + (isActive ? "active" : "")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="nav-group component-nav">
        <span className="nav-group-title">
          Directory <span className="tabular-count">{filtered.length}</span>
        </span>
        {filtered.map((item) => (
          <NavLink
            key={item.slug}
            to={"/components/" + item.slug}
            className={({ isActive }) =>
              "sidebar-link component-link " + (isActive ? "active" : "")
            }
          >
            <span>{item.name}</span>
            <span className="component-meta-inline">{item.category}</span>
          </NavLink>
        ))}
        {filtered.length === 0 && (
          <span className="empty-search">No matching components</span>
        )}
      </div>

      <div className="sidebar-bottom">
        <span>MIT License · Client-side React 19</span>
      </div>
    </aside>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="topbar">
      {/* Zone 1: Single-line brand wordmark */}
      <Link to="/" className="topbar-brand">
        Liquid UI
      </Link>

      {/* Zone 2: 5 concise single-line navigation links */}
      <nav className="topbar-nav" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "topbar-nav-link " + (isActive ? "active" : "")
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/components"
          className={({ isActive }) =>
            "topbar-nav-link " +
            (isActive || location.pathname.startsWith("/components/")
              ? "active"
              : "")
          }
        >
          Components
        </NavLink>
        <NavLink
          to="/3d"
          className={({ isActive }) =>
            "topbar-nav-link " + (isActive ? "active" : "")
          }
        >
          3D Studio
        </NavLink>
        <NavLink
          to="/examples"
          className={({ isActive }) =>
            "topbar-nav-link " + (isActive ? "active" : "")
          }
        >
          Patterns
        </NavLink>
        <NavLink
          to="/getting-started"
          className={({ isActive }) =>
            "topbar-nav-link " +
            (isActive ||
            location.pathname === "/installation" ||
            location.pathname === "/api"
              ? "active"
              : "")
          }
        >
          Documentation
        </NavLink>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="topbar-cta">
        <button
          type="button"
          className="topbar-action-btn"
          onClick={() => navigate("/components")}
        >
          Explore Library
        </button>
      </div>
    </header>
  );
}

function Shell() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="workspace-layout">
        <Sidebar />
        <div className="site-column">
          <main className="main-content">
            <Outlet />
          </main>
          <footer className="site-footer">
            <span>
              Liquid UI · Tactile glass, spring motion, and Three.js primitives
              for React
            </span>
            <div className="footer-links">
              <Link to="/installation">Installation</Link>
              <span aria-hidden="true">·</span>
              <Link to="/api">API Reference</Link>
              <span aria-hidden="true">·</span>
              <a href={repoUrl} target="_blank" rel="noreferrer">
                GitHub Repository ↗
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <p className="section-kicker">{children}</p>;
}

function ComponentGrid({ filter }: { filter?: string }) {
  const [activeFilter, setActiveFilter] = useState<string>(filter ?? "All");
  const effectiveFilter = filter ?? activeFilter;

  const items = components.filter(
    (item) =>
      effectiveFilter === "All" ||
      item.category.toLowerCase() === effectiveFilter.toLowerCase()
  );

  return (
    <div>
      {!filter && (
        <div
          className="filter-segmented-bar"
          role="tablist"
          aria-label="Filter components by category"
        >
          {["All", "UI", "3D", "Motion", "Backgrounds"].map((cat) => {
            const count =
              cat === "All"
                ? components.length
                : components.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeFilter === cat}
                className={
                  "filter-segment-btn " + (activeFilter === cat ? "active" : "")
                }
                onClick={() => setActiveFilter(cat)}
              >
                {cat === "All" ? "All Primitives" : cat}{" "}
                <span className="segment-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="component-grid">
        {items.map((item, index) => (
          <Link
            className="component-tile"
            to={"/components/" + item.slug}
            key={item.slug}
          >
            <div className="tile-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true">·</span>
              <span>{item.category}</span>
              <span aria-hidden="true">·</span>
              <span>{item.importFrom ? "Three.js" : "Core DOM"}</span>
            </div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="tile-link">
              Open interactive studio <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [studioMode, setStudioMode] = useState<"orb" | "knot" | "morph">("orb");
  const [studioColor, setStudioColor] = useState("#38bdf8");
  const [pointerCoords, setPointerCoords] = useState({ x: 50, y: 50 });
  const [tactileCount, setTactileCount] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText("pnpm add @rzxiui/react framer-motion gsap");
      setCopiedCmd(true);
      window.setTimeout(() => setCopiedCmd(false), 1500);
    } catch {
      setCopiedCmd(false);
    }
  };

  return (
    <div className="page home-page">
      {/* Hero Section: 2-Column Split + Full-Width 4-Column Metrics Row Below */}
      <section className="hero">
        <div className="hero-copy">
          <SectionKicker>
            React 19 · Three.js · Hardware-Accelerated CSS
          </SectionKicker>
          <h1>
            Refractive surfaces and spatial motion, engineered for production.
          </h1>
          <p className="hero-lede">
            Liquid UI is a modular component architecture combining optical
            glass surfaces, compositor-driven micro-interactions, and
            tree-shakeable WebGL scenes that pause automatically offscreen.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/components">
              Browse 18 Primitives <span aria-hidden="true">→</span>
            </Link>
            <Link className="secondary-link" to="/getting-started">
              Read Architecture Guide
            </Link>
          </div>
          <div className="hero-metadata-line">
            <span>18 Accessible Components</span>
            <span aria-hidden="true">·</span>
            <span>Isolated /three Entrypoint</span>
            <span aria-hidden="true">·</span>
            <span>Reduced-Motion Native</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-studio-header">
            <div className="studio-scene-tabs" role="tablist" aria-label="3D Scene Geometry">
              <button
                type="button"
                role="tab"
                aria-selected={studioMode === "orb"}
                className={studioMode === "orb" ? "active" : ""}
                onClick={() => setStudioMode("orb")}
              >
                Refractive Orb
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={studioMode === "knot"}
                className={studioMode === "knot" ? "active" : ""}
                onClick={() => setStudioMode("knot")}
              >
                Torus Knot
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={studioMode === "morph"}
                className={studioMode === "morph" ? "active" : ""}
                onClick={() => setStudioMode("morph")}
              >
                Superellipsoid
              </button>
            </div>
            <div className="studio-color-dots" role="group" aria-label="Material tint">
              {[
                { label: "Sky", hex: "#38bdf8" },
                { label: "Platinum", hex: "#e2e8f0" },
                { label: "Indigo", hex: "#818cf8" },
                { label: "Emerald", hex: "#34d399" },
              ].map((tint) => (
                <button
                  key={tint.hex}
                  type="button"
                  aria-label={tint.label}
                  title={tint.label}
                  className={
                    "studio-tint-btn " +
                    (studioColor === tint.hex ? "active" : "")
                  }
                  style={{ "--tint-color": tint.hex } as React.CSSProperties}
                  onClick={() => setStudioColor(tint.hex)}
                />
              ))}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="hero-orb-fallback">
                <MorphingLoader color={studioColor} label="Loading 3D studio" />
              </div>
            }
          >
            <HeroStudioScene mode={studioMode} color={studioColor} />
          </Suspense>

          <div className="hero-studio-footer">
            <span>Three-Point Studio Lighting · Move cursor to deflect mesh</span>
            <Link to={"/components/" + (studioMode === "orb" ? "liquid-orb" : studioMode === "knot" ? "floating-object" : "morphing-shape")}>
              Open in Playground →
            </Link>
          </div>
        </div>
      </section>

      {/* Full-width 4-Column Architectural Metrics Strip */}
      <section className="signal-row" aria-label="Library specifications">
        <div className="metric-cell">
          <strong>18</strong>
          <span>Exported React &amp; WebGL primitives</span>
        </div>
        <div className="metric-cell">
          <strong>3.8 kB</strong>
          <span>Core CSS &amp; glass surface footprint</span>
        </div>
        <div className="metric-cell">
          <strong>0 ms</strong>
          <span>Main-thread re-renders on pointer tracking</span>
        </div>
        <div className="metric-cell">
          <strong>100%</strong>
          <span>WCAG AA focus &amp; reduced-motion compliance</span>
        </div>
      </section>

      {/* Asymmetric Bento Live Surface Workbench */}
      <section className="home-section showcase-section">
        <div className="section-heading">
          <div>
            <SectionKicker>Live Interactive Workbench</SectionKicker>
            <h2>
              Real mounted primitives.{" "}
              <span>Test the physics directly in place.</span>
            </h2>
          </div>
          <Link to="/components" className="text-link">
            Inspect all 18 components <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="bento-showcase-grid">
          {/* Span 2: SpotlightCard with live pointer telemetry */}
          <SpotlightCard
            className="bento-card bento-span-2"
            color="#38bdf8"
            intensity={0.78}
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPointerCoords({
                x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
                y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
              });
            }}
          >
            <div className="bento-meta">
              <span>01 · SpotlightCard</span>
              <span className="tabular-readout">
                Pointer X: {pointerCoords.x}% · Y: {pointerCoords.y}%
              </span>
            </div>
            <div className="bento-body">
              <h3>Zero-re-render radial illumination.</h3>
              <p>
                Coordinates stream directly to CSS custom properties
                (--li-px, --li-py), creating a responsive 380px specular field
                without triggering React state updates.
              </p>
            </div>
            <div className="bento-footer">
              <Link to="/components/spotlight-card" className="text-link">
                Configure SpotlightCard props →
              </Link>
            </div>
          </SpotlightCard>

          {/* Span 1: ThreeDCard perspective surface */}
          <ThreeDCard
            className="bento-card bento-span-1"
            color="#818cf8"
            intensity={0.82}
          >
            <div className="bento-meta">
              <span>02 · ThreeDCard</span>
              <span>900px Perspective</span>
            </div>
            <div className="bento-body">
              <h3>Subpixel-safe 3D pitch &amp; yaw.</h3>
              <p>
                Move your mouse across this surface to test hardware-accelerated
                planar rotation with automatic spring return on pointer exit.
              </p>
            </div>
            <div className="bento-footer">
              <Link to="/components/3d-card" className="text-link">
                Open ThreeDCard →
              </Link>
            </div>
          </ThreeDCard>

          {/* Span 1: Tactile Controls Workbench */}
          <GlassPanel className="bento-card bento-span-1" tint="#38bdf8">
            <div className="bento-meta">
              <span>03 · Tactile Controls</span>
              <span className="tabular-readout">Events: {tactileCount}</span>
            </div>
            <div className="bento-body">
              <h3>Magnetic &amp; depth response.</h3>
              <p>
                Pair pointer attraction with physical press displacement.
              </p>
              <div className="bento-controls-demo">
                <MagneticElement strength={12}>
                  <LiquidButton
                    color="#38bdf8"
                    onClick={() => setTactileCount((c) => c + 1)}
                  >
                    Liquid Specular
                  </LiquidButton>
                </MagneticElement>
                <DepthButton
                  color="#818cf8"
                  onClick={() => setTactileCount((c) => c + 1)}
                >
                  Depth Press
                </DepthButton>
              </div>
            </div>
            <div className="bento-footer">
              <Link to="/components/liquid-button" className="text-link">
                Compare button primitives →
              </Link>
            </div>
          </GlassPanel>

          {/* Span 2: ParticleField + Workspace Installation */}
          <div className="bento-card bento-span-2 bento-particle-card">
            <div className="bento-particle-bg">
              <ParticleField color="#38bdf8" speed={0.5} density={38} />
            </div>
            <div className="bento-particle-overlay">
              <div className="bento-meta">
                <span>04 · ParticleField &amp; Workspace Setup</span>
                <span>IntersectionObserver Managed</span>
              </div>
              <div className="bento-install-row">
                <div>
                  <h3>Drop into any modern React 18 or 19 workspace.</h3>
                  <p>
                    Import the core package for DOM surfaces and motion, and load
                    the optional Three.js entry only on routes that render 3D.
                  </p>
                </div>
                <div className="install-command-box">
                  <code>pnpm add @rzxiui/react framer-motion gsap</code>
                  <button
                    type="button"
                    className="copy-inline-btn"
                    onClick={copyInstall}
                  >
                    {copiedCmd ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Directory */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <SectionKicker>System Taxonomy</SectionKicker>
            <h2>
              Four specialized layers.{" "}
              <span>One cohesive visual grammar.</span>
            </h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((item, idx) => (
            <Link to={item.href} className="category-card" key={item.href}>
              <div className="category-card-top">
                <span>0{idx + 1}. {item.label}</span>
                <span className="tabular-count">{item.count} items</span>
              </div>
              <p>{item.note}</p>
              <span className="category-explore">
                Explore {item.label.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Architectural Principles (Clean Editorial Numbering) */}
      <section className="home-section principles-grid-section">
        <div className="section-heading">
          <div>
            <SectionKicker>Engineering Principles</SectionKicker>
            <h2>
              Built for real engineering teams,{" "}
              <span>not dribbble screenshots.</span>
            </h2>
          </div>
        </div>
        <div className="principles-list">
          <article className="principle-item">
            <span className="principle-num">01.</span>
            <h3>Optical Glass Without Contrast Loss</h3>
            <p>
              Every translucent surface pairs backdrop saturation with a solid
              luminance floor and 1px hairline border so typography meets WCAG AA
              contrast ratios over arbitrary backgrounds.
            </p>
          </article>
          <article className="principle-item">
            <span className="principle-num">02.</span>
            <h3>Subpath-Isolated WebGL Bundle</h3>
            <p>
              Three.js, React Three Fiber, and Drei live exclusively under{" "}
              <code>@rzxiui/react/three</code>. Pages using standard buttons,
              modals, and cards never download a 3D engine.
            </p>
          </article>
          <article className="principle-item">
            <span className="principle-num">03.</span>
            <h3>Offscreen Hibernation &amp; Reduced Motion</h3>
            <p>
              Canvas particle fields and WebGL scenes attach{" "}
              <code>IntersectionObserver</code> instances to halt{" "}
              <code>requestAnimationFrame</code> loops the moment they leave the
              viewport.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

function ComponentsPage() {
  return (
    <div className="page docs-page">
      <SectionKicker>Component Catalog · 18 Primitives</SectionKicker>
      <h1>All Components</h1>
      <p className="page-intro">
        Explore the complete set of refractive glass surfaces, tactile buttons,
        scroll-triggered animations, and Three.js scenes. Select any component
        to customize live props and copy the JSX snippet.
      </p>
      <ComponentGrid />
    </div>
  );
}

function CategoryPage({ category }: { category: string }) {
  const title = category === "3D" ? "3D WebGL Scenes" : category;
  const list = components.filter((item) => item.category === category);
  return (
    <div className="page docs-page">
      <SectionKicker>
        Category · {list.length} {list.length === 1 ? "Component" : "Components"}
      </SectionKicker>
      <h1>{title}</h1>
      <p className="page-intro">
        {category === "3D"
          ? "Three-point studio lit WebGL scenes loaded from an isolated subpath, capped at 1.5x DPR, and automatically paused when scrolled out of view."
          : category === "Motion"
          ? "Hardware-accelerated motion primitives with automatic observer cleanup and native prefers-reduced-motion support."
          : "Atmospheric CSS and HTML5 Canvas fields that add spatial depth without initializing a 3D WebGL context."}
      </p>
      <ComponentGrid filter={category} />
    </div>
  );
}

function ComponentPage() {
  const { slug } = useParams();
  const meta = bySlug(slug);
  if (!meta) return <Navigate to="/components" replace />;
  return (
    <div className="page component-page">
      <div className="component-page-heading">
        <div>
          <SectionKicker>
            {meta.category} Primitive ·{" "}
            {meta.importFrom ?? "@rzxiui/react"}
          </SectionKicker>
          <h1>{meta.name}</h1>
          <p className="page-intro">{meta.description}</p>
        </div>
      </div>
      <Playground meta={meta} />
      <section className="usage-section">
        <SectionKicker>Integration Notes</SectionKicker>
        <h2>Composable DOM &amp; Style Contract</h2>
        <p>
          Every component forwards standard HTML attributes and merges custom{" "}
          <code>className</code> overrides cleanly. Load the core stylesheet
          once at your application root.
        </p>
        <div className="usage-callout">
          <span>Root stylesheet import</span>
          <code>import &quot;@rzxiui/react/styles.css&quot;;</code>
        </div>
      </section>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="doc-code">
      <code>{children}</code>
    </pre>
  );
}

function InstallationPage() {
  return (
    <div className="page docs-page">
      <SectionKicker>Workspace Setup</SectionKicker>
      <h1>Installation</h1>
      <p className="page-intro">
        Liquid UI is structured as a modular monorepo with separate entrypoints
        for core DOM primitives, design tokens, and Three.js scenes.
      </p>
      <div className="content-card">
        <h2>01. Clone and run the interactive studio</h2>
        <p>
          Install workspace dependencies and launch the development server on
          port 3000.
        </p>
        <CodeBlock>
          {
            "git clone https://github.com/MuhammadAsad809/RzxiUi.git\ncd RzxiUi\nnpm install\nnpm run dev"
          }
        </CodeBlock>
      </div>
      <div className="content-card">
        <h2>02. Install packages in your application</h2>
        <p>
          Install the core package alongside Framer Motion and GSAP. Add Three.js
          peer dependencies only if your project uses the <code>/three</code>{" "}
          subpath.
        </p>
        <CodeBlock>
          {
            "npm install @rzxiui/react framer-motion gsap\n\n# Optional 3D WebGL peer dependencies\nnpm install three @react-three/fiber @react-three/drei"
          }
        </CodeBlock>
        <CodeBlock>
          {
            "import { GlassPanel, LiquidButton } from '@rzxiui/react';\nimport '@rzxiui/react/styles.css';"
          }
        </CodeBlock>
      </div>
      <div className="content-card">
        <h2>03. Progressive enhancement &amp; WebGL safety</h2>
        <p>
          Core components render semantic HTML and CSS custom properties. WebGL
          components attach context-loss listeners and render an accessible
          fallback when hardware acceleration is unavailable.
        </p>
      </div>
    </div>
  );
}

function GettingStartedPage() {
  return (
    <div className="page docs-page">
      <SectionKicker>Quickstart Guide</SectionKicker>
      <h1>Getting Started</h1>
      <p className="page-intro">
        Import the base stylesheet once at your application entry point, then
        compose interfaces from standard typed React components.
      </p>
      <div className="steps-list">
        <article>
          <span>01.</span>
          <div>
            <h2>Import the core stylesheet</h2>
            <p>
              Provides CSS custom properties, glassmorphism backdrop rules, and
              reduced-motion media query overrides.
            </p>
            <CodeBlock>{"import \"@rzxiui/react/styles.css\";"}</CodeBlock>
          </div>
        </article>
        <article>
          <span>02.</span>
          <div>
            <h2>Compose a refractive surface</h2>
            <p>
              Combine <code>GlassPanel</code> with tactile action buttons for
              high-contrast dialogs, cards, and hero callouts.
            </p>
            <CodeBlock>
              {
                "import { GlassPanel, LiquidButton } from \"@rzxiui/react\";\n\nexport function DeploymentCard() {\n  return (\n    <GlassPanel intensity={0.75} tint=\"#38bdf8\">\n      <h2>Production Environment Ready</h2>\n      <LiquidButton color=\"#38bdf8\">Promote Release</LiquidButton>\n    </GlassPanel>\n  );\n}"
              }
            </CodeBlock>
          </div>
        </article>
        <article>
          <span>03.</span>
          <div>
            <h2>Lazy-load 3D scenes on demand</h2>
            <p>
              Import WebGL components from <code>@rzxiui/react/three</code> so
              standard UI routes stay lightweight.
            </p>
            <CodeBlock>
              {
                "import { LiquidOrb } from \"@rzxiui/react/three\";\n\nexport function HeroViewport() {\n  return <LiquidOrb color=\"#38bdf8\" intensity={0.85} height={360} />;\n}"
              }
            </CodeBlock>
          </div>
        </article>
      </div>
    </div>
  );
}

function ApiPage() {
  return (
    <div className="page docs-page">
      <SectionKicker>Technical Specification</SectionKicker>
      <h1>API &amp; Props Reference</h1>
      <p className="page-intro">
        All components export strict TypeScript interfaces and share a
        consistent prop vocabulary for color, intensity, and motion timing.
      </p>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Applies To</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>undefined</td>
              <td>All components</td>
              <td>Appends custom layout or utility classes to root node.</td>
            </tr>
            <tr>
              <td>color / tint</td>
              <td>string (Hex/RGB)</td>
              <td>#38bdf8</td>
              <td>Buttons, Cards, 3D</td>
              <td>Sets specular border, radial glow, or physical material tint.</td>
            </tr>
            <tr>
              <td>intensity</td>
              <td>number (0.1 – 1.0)</td>
              <td>0.72</td>
              <td>Glass, Cards, 3D</td>
              <td>Scales backdrop reflection opacity or chromatic aberration.</td>
            </tr>
            <tr>
              <td>speed</td>
              <td>number (0.35 – 1.8)</td>
              <td>1.0</td>
              <td>Motion, Canvas, 3D</td>
              <td>Multiplier for animation frequency and orbital rotation.</td>
            </tr>
            <tr>
              <td>shape</td>
              <td>union string</td>
              <td>&quot;knot&quot; / &quot;cube&quot;</td>
              <td>FloatingObject, MorphingShape</td>
              <td>Selects 3D mesh topology or superellipsoid exponent target.</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>boolean</td>
              <td>false</td>
              <td>LiquidButton, DepthButton</td>
              <td>Disables pointer response and applies accessible muted state.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="api-subheading">Interactive Component Directory</h2>
      <div className="api-component-list">
        {components.map((item, idx) => (
          <Link to={"/components/" + item.slug} key={item.slug}>
            <span>
              <strong className="tabular-index">
                {String(idx + 1).padStart(2, "0")}.
              </strong>{" "}
              {item.name}
            </span>
            <span>{item.category}</span>
            <span>{item.importFrom ?? "@rzxiui/react"}</span>
            <span>Inspect in Studio →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExamplesPage() {
  return (
    <div className="page docs-page">
      <SectionKicker>Composed Patterns</SectionKicker>
      <h1>Production Patterns</h1>
      <p className="page-intro">
        Multi-component compositions combining ambient fields, optical glass
        containers, and pointer-reactive cards.
      </p>
      <div className="examples-grid">
        <div className="example-card">
          <div className="example-demo">
            <AnimatedBackground className="example-ambient">
              <GlassPanel className="example-panel" tint="#38bdf8">
                <span className="preview-kicker">Release Pipeline · v2.4</span>
                <h3>Zero-downtime edge deployment ready.</h3>
                <LiquidButton color="#38bdf8">
                  Deploy to Production →
                </LiquidButton>
              </GlassPanel>
            </AnimatedBackground>
          </div>
          <div className="example-card-caption">
            <h2>01. Atmospheric Glass Callout</h2>
            <p>
              Pairs <code>AnimatedBackground</code> with <code>GlassPanel</code>{" "}
              and a primary <code>LiquidButton</code> CTA.
            </p>
          </div>
        </div>

        <div className="example-card">
          <div className="example-demo example-card-demo">
            <SpotlightCard className="example-spotlight" color="#38bdf8">
              <span className="preview-kicker">Telemetry Node · US-East</span>
              <h3>99.98% p95 frame stability across desktop viewports.</h3>
              <p>
                Pointer-bound radial illumination highlights key architecture
                cards without WebGL overhead.
              </p>
            </SpotlightCard>
          </div>
          <div className="example-card-caption">
            <h2>02. Cursor-Tracked Feature Card</h2>
            <p>
              Uses <code>SpotlightCard</code> to guide visual hierarchy across
              dense bento grids.
            </p>
          </div>
        </div>

        <div className="example-card">
          <div className="example-demo example-loader-demo">
            <MorphingLoader label="Synchronizing shaders" size={52} color="#38bdf8" />
            <span>Compiling WebGL transmission buffers…</span>
          </div>
          <div className="example-card-caption">
            <h2>03. Accessible Suspense Fallback</h2>
            <p>
              Drop <code>MorphingLoader</code> inside React{" "}
              <code>Suspense</code> boundaries while lazy-loading 3D scenes.
            </p>
          </div>
        </div>

        <div className="example-card">
          <div className="example-demo">
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <DepthButton color="#38bdf8">Run Diagnostics</DepthButton>
              <LiquidButton color="#818cf8">Export Report</LiquidButton>
            </div>
          </div>
          <div className="example-card-caption">
            <h2>04. Tactile Action Pair</h2>
            <p>
              Combine physical elevation press (<code>DepthButton</code>) with
              specular hover sweep (<code>LiquidButton</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page docs-page">
      <SectionKicker>404 · Route Not Found</SectionKicker>
      <h1>That page does not exist.</h1>
      <p className="page-intro">
        Return to the component catalog to explore all 18 primitives.
      </p>
      <Link to="/components" className="primary-link">
        Browse Component Catalog →
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="components/:slug" element={<ComponentPage />} />
        <Route path="3d" element={<CategoryPage category="3D" />} />
        <Route path="animations" element={<CategoryPage category="Motion" />} />
        <Route
          path="backgrounds"
          element={<CategoryPage category="Backgrounds" />}
        />
        <Route path="installation" element={<InstallationPage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />
        <Route path="api" element={<ApiPage />} />
        <Route path="examples" element={<ExamplesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

