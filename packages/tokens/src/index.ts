export const liquidTokens = {
  color: {
    ink: "#080a0a",
    surface: "#101414",
    glass: "rgba(229, 255, 246, 0.08)",
    mint: "#a9f2d1",
    lilac: "#b9a8ff",
    text: "#f1f5f3",
    muted: "#89938e",
    line: "rgba(218, 255, 240, 0.14)",
  },
  radius: { sm: "10px", md: "16px", lg: "24px", pill: "999px" },
  shadow: { glass: "0 22px 72px rgba(0, 0, 0, 0.42)", glow: "0 0 38px rgba(169, 242, 209, 0.12)" },
  motion: { fast: "160ms", normal: "280ms", slow: "620ms", spring: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
} as const;

export type LiquidTokens = typeof liquidTokens;
