import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import gsap from "gsap";

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

type DivProps = HTMLAttributes<HTMLDivElement>;
export interface AnimatedBackgroundProps extends DivProps { intensity?: number; speed?: number; }
export function AnimatedBackground({ className, style, intensity = 0.5, speed = 1, children, ...props }: AnimatedBackgroundProps) {
  return <div {...props} className={cx("li-animated-bg", className)} style={{ ...style, "--li-intensity": intensity, "--li-speed": speed } as CSSProperties}><div className="li-animated-bg-glow" aria-hidden="true" />{children}</div>;
}

export interface GradientMeshProps extends DivProps { colors?: string[]; intensity?: number; speed?: number; }
export function GradientMesh({ colors = ["#234a3c", "#342b5b", "#122e32"], intensity = 0.7, speed = 18, className, style, children, ...props }: GradientMeshProps) {
  const first = colors[0] ?? "#234a3c";
  const second = colors[1] ?? "#342b5b";
  const third = colors[2] ?? "#122e32";
  return <div {...props} className={cx("li-gradient-mesh", className)} style={{ ...style, "--li-mesh-a": first, "--li-mesh-b": second, "--li-mesh-c": third, "--li-intensity": intensity, "--li-speed": speed + "s" } as CSSProperties}><span className="li-mesh-blob li-mesh-blob-a" /><span className="li-mesh-blob li-mesh-blob-b" /><span className="li-mesh-blob li-mesh-blob-c" />{children && <div className="li-mesh-content">{children}</div>}</div>;
}

export interface ParticleFieldProps extends DivProps { color?: string; speed?: number; density?: number; }
interface Particle { x: number; y: number; vx: number; vy: number; radius: number; }
export function ParticleField({ color = "#a9f2d1", speed = 0.42, density = 30, className, ...props }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;
    let frame = 0;
    let visible = false;
    let width = 1;
    let height = 1;
    let particles: Particle[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(8, Math.min(90, Math.round(density * width * height / 140000)));
      particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed, radius: 0.7 + Math.random() * 1.8 }));
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      for (const particle of particles) {
        if (!reduced) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          const dx = particle.x - pointer.current.x;
          const dy = particle.y - pointer.current.y;
          if (dx * dx + dy * dy < 5600) { particle.x += dx * 0.0016; particle.y += dy * 0.0016; }
        }
        context.globalAlpha = 0.28 + (particle.radius / 2.5) * 0.48;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!reduced && visible) frame = window.requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(draw); }
      else window.cancelAnimationFrame(frame);
    }, { rootMargin: "80px" });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    observer.observe(host);
    resize();
    if (reduced) draw();
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); };
  }, [color, density, speed]);
  const trackPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const resetPointer = () => { pointer.current = { x: -1000, y: -1000 }; };
  return <div {...props} ref={hostRef} className={cx("li-particle-field", className)} onPointerMove={trackPointer} onPointerLeave={resetPointer} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

export interface TextRevealProps extends HTMLAttributes<HTMLSpanElement> { children: ReactNode; delay?: number; distance?: number; }
export function TextReveal({ children, delay = 0, distance = 18, className, style, ...props }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <span {...props} ref={ref} className={cx("li-text-reveal", visible && "is-visible", className)} style={{ ...style, "--li-delay": delay + "ms", "--li-distance": distance + "px" } as CSSProperties}>{children}</span>;
}

export interface MagneticElementProps extends DivProps { strength?: number; }
export function MagneticElement({ strength = 10, className, onPointerMove, onPointerLeave, ...props }: MagneticElementProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (enabled) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      event.currentTarget.style.transform = "translate3d(" + (x * strength) + "px," + (y * strength) + "px,0)";
    }
    onPointerMove?.(event);
  };
  const leave = (event: React.PointerEvent<HTMLDivElement>) => { event.currentTarget.style.transform = "translate3d(0,0,0)"; onPointerLeave?.(event); };
  return <div {...props} onPointerMove={move} onPointerLeave={leave} className={cx("li-magnetic", className)} />;
}

export interface ScrollSceneProps extends DivProps { children: ReactNode; delay?: number; distance?: number; once?: boolean; }
export function ScrollScene({ children, delay = 0, distance = 18, once = true, className, ...props }: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { gsap.set(node, { clearProps: "all" }); return; }
    let played = false;
    const observer = new IntersectionObserver((entries) => {
      const inView = entries[0]?.isIntersecting ?? false;
      if (inView && (!once || !played)) {
        played = true;
        gsap.fromTo(node, { autoAlpha: 0, y: distance }, { autoAlpha: 1, y: 0, delay: delay / 1000, duration: 0.58, ease: "power3.out", overwrite: true });
      } else if (!inView && !once) gsap.set(node, { autoAlpha: 0, y: distance });
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => { observer.disconnect(); gsap.killTweensOf(node); };
  }, [delay, distance, once]);
  return <div {...props} ref={ref} className={cx("li-scroll-scene", className)}>{children}</div>;
}
