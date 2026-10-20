import React, { useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

type DivProps = HTMLAttributes<HTMLDivElement>;

export interface GlassPanelProps extends DivProps { intensity?: number; tint?: string; }
export function GlassPanel({ className, style, intensity = 0.62, tint = "#d9fff0", ...props }: GlassPanelProps) {
  return <div {...props} className={cx("li-glass", className)} style={{ ...style, "--li-intensity": intensity, "--li-tint": tint } as CSSProperties} />;
}

export interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { color?: string; intensity?: number; speed?: number; }
export function LiquidButton({ className, style, color = "#a9f2d1", intensity = 0.7, speed = 1, type = "button", ...props }: LiquidButtonProps) {
  return <button {...props} type={type} className={cx("li-button", className)} style={{ ...style, "--li-accent": color, "--li-intensity": intensity, "--li-speed": speed } as CSSProperties} />;
}

export interface DepthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { color?: string; }
export function DepthButton({ className, style, color = "#a9f2d1", type = "button", ...props }: DepthButtonProps) {
  return <button {...props} type={type} className={cx("li-depth-button", className)} style={{ ...style, "--li-accent": color } as CSSProperties} />;
}

export interface HolographicCardProps extends DivProps { color?: string; intensity?: number; }
export function HolographicCard({ className, style, color = "#b9a8ff", intensity = 0.7, onPointerMove, onPointerLeave, ...props }: HolographicCardProps) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--li-px", ((event.clientX - rect.left) / rect.width * 100) + "%");
    event.currentTarget.style.setProperty("--li-py", ((event.clientY - rect.top) / rect.height * 100) + "%");
    onPointerMove?.(event);
  };
  const leave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--li-px", "50%");
    event.currentTarget.style.setProperty("--li-py", "50%");
    onPointerLeave?.(event);
  };
  return <div {...props} onPointerMove={move} onPointerLeave={leave} className={cx("li-holo-card", className)} style={{ ...style, "--li-accent": color, "--li-intensity": intensity } as CSSProperties} />;
}

export interface SpotlightCardProps extends DivProps { color?: string; intensity?: number; }
export function SpotlightCard({ className, style, color = "#a9f2d1", intensity = 0.66, onPointerMove, onPointerLeave, ...props }: SpotlightCardProps) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--li-px", ((event.clientX - rect.left) / rect.width * 100) + "%");
    event.currentTarget.style.setProperty("--li-py", ((event.clientY - rect.top) / rect.height * 100) + "%");
    onPointerMove?.(event);
  };
  const leave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--li-px", "50%");
    event.currentTarget.style.setProperty("--li-py", "50%");
    onPointerLeave?.(event);
  };
  return <div {...props} onPointerMove={move} onPointerLeave={leave} className={cx("li-spotlight-card", className)} style={{ ...style, "--li-accent": color, "--li-intensity": intensity } as CSSProperties} />;
}

export interface ThreeDCardProps extends DivProps { color?: string; intensity?: number; }
export function ThreeDCard({ className, style, color = "#a9f2d1", intensity = 0.8, onPointerMove, onPointerLeave, ...props }: ThreeDCardProps) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--li-rotate-x", (-y * 8) + "deg");
    event.currentTarget.style.setProperty("--li-rotate-y", (x * 10) + "deg");
    event.currentTarget.style.setProperty("--li-px", ((x + 0.5) * 100) + "%");
    event.currentTarget.style.setProperty("--li-py", ((y + 0.5) * 100) + "%");
    onPointerMove?.(event);
  };
  const leave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--li-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--li-rotate-y", "0deg");
    onPointerLeave?.(event);
  };
  return <div {...props} onPointerMove={move} onPointerLeave={leave} className={cx("li-3d-card", className)} style={{ ...style, "--li-accent": color, "--li-intensity": intensity } as CSSProperties} />;
}

export interface NavigationItem { label: string; href: string; value?: string; }
export interface LiquidNavigationProps extends HTMLAttributes<HTMLElement> { items: NavigationItem[]; current?: string; onSelect?: (item: NavigationItem) => void; depth?: boolean; }
export function LiquidNavigation({ items, current, onSelect, depth = false, className, ...props }: LiquidNavigationProps) {
  return <nav {...props} aria-label={props["aria-label"] ?? "Primary navigation"} className={cx("li-nav", depth && "li-nav-depth", className)}>
    {items.map((item) => {
      const value = item.value ?? item.href;
      return <a key={value} href={item.href} className={cx("li-nav-link", current === value && "is-active")} aria-current={current === value ? "page" : undefined} onClick={() => onSelect?.(item)}>{item.label}</a>;
    })}
  </nav>;
}
export const ThreeDNavigation = (props: LiquidNavigationProps) => <LiquidNavigation {...props} depth />;

export interface GlassModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode; className?: string; }
export function GlassModal({ open, onOpenChange, title, children, className }: GlassModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <AnimatePresence>
    {open && <motion.dialog ref={ref} className={cx("li-modal", className)} aria-labelledby="li-modal-title" initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} onCancel={(event) => { event.preventDefault(); onOpenChange(false); }} onClose={() => onOpenChange(false)} onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }}>
      <div className="li-modal-surface"><div className="li-modal-heading"><h2 id="li-modal-title">{title}</h2><button className="li-icon-button" type="button" aria-label="Close dialog" onClick={() => onOpenChange(false)}>×</button></div><div className="li-modal-content">{children}</div></div>
    </motion.dialog>}
  </AnimatePresence>;
}

export interface MorphingLoaderProps extends HTMLAttributes<HTMLDivElement> { color?: string; size?: number; label?: string; }
export function MorphingLoader({ color = "#a9f2d1", size = 44, label = "Loading", className, style, ...props }: MorphingLoaderProps) {
  return <div {...props} className={cx("li-loader-wrap", className)} role="status" aria-label={label} style={{ ...style, "--li-accent": color, "--li-size": size + "px" } as CSSProperties}><span className="li-loader" aria-hidden="true" /><span className="li-visually-hidden">{label}</span></div>;
}
