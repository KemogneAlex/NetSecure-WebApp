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
  bg: "#0A0E1A",
  bgSecondary: "#0F1628",
  bgCard: "#141B2D",
  bgElevated: "#1A2236",
  border: "#1E2D45",
  textPrimary: "#E8EDF5",
  textSecondary: "#8892A4",
  textMuted: "#4A5568",
  accent: "#00D4FF",
  accentDim: "rgba(0,212,255,0.1)",
  green: "#00E676",
  red: "#FF3B3B",
  orange: "#FF9800",
  purple: "#7C3AED",
};

export const lightColors = {
  bg: "#F8FAFC",
  bgSecondary: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgElevated: "#F1F5F9",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  accent: "#0284C7",
  accentDim: "rgba(2,132,199,0.1)",
  green: "#16A34A",
  red: "#DC2626",
  orange: "#EA580C",
  purple: "#7C3AED",
};
