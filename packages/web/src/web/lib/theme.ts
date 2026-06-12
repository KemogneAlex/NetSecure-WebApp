import { createContext, useContext, useState, useEffect } from "react";

export type Theme = "dark" | "light";

export const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export const darkColors = {
  bg: "#080C12",
  bgSecondary: "#0C1018",
  bgCard: "#111720",
  bgElevated: "#161E2A",
  border: "#1C2535",
  borderSubtle: "#141C28",
  textPrimary: "#EEF2F8",
  textSecondary: "#7A8899",
  textMuted: "#3D4E62",
  accent: "#10B981",       // vert émeraude
  accentDim: "rgba(16,185,129,0.08)",
  accentHover: "#0EA372",
  blue: "#3B82F6",
  blueDim: "rgba(59,130,246,0.1)",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.1)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.1)",
  orange: "#F59E0B",
  orangeDim: "rgba(245,158,11,0.1)",
  purple: "#8B5CF6",
  purpleDim: "rgba(139,92,246,0.1)",
};

export const lightColors = {
  bg: "#F9FAFB",
  bgSecondary: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgElevated: "#F3F4F6",
  border: "#E5E7EB",
  borderSubtle: "#F3F4F6",
  textPrimary: "#0D1117",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  accent: "#059669",
  accentDim: "rgba(5,150,105,0.08)",
  accentHover: "#047857",
  blue: "#2563EB",
  blueDim: "rgba(37,99,235,0.08)",
  green: "#059669",
  greenDim: "rgba(5,150,105,0.08)",
  red: "#DC2626",
  redDim: "rgba(220,38,38,0.08)",
  orange: "#D97706",
  orangeDim: "rgba(217,119,6,0.08)",
  purple: "#7C3AED",
  purpleDim: "rgba(124,58,237,0.08)",
};
