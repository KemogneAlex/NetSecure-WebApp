# NetSecure — Design System

## Brand
- **Product**: NetSecure
- **Tagline**: "Votre réseau. Sous contrôle."
- **Vibe**: Professional cybersecurity SaaS — dark hacker aesthetic meets clean enterprise UI

## Color Palette

### Dark Mode (default)
- Background primary: `#0A0E1A`
- Background secondary: `#0F1628`
- Background card: `#141B2D`
- Background elevated: `#1A2236`
- Border: `#1E2D45`
- Text primary: `#E8EDF5`
- Text secondary: `#8892A4`
- Text muted: `#4A5568`
- Accent cyan: `#00D4FF`
- Accent cyan dim: `#00D4FF20`
- Accent green (safe): `#00E676`
- Accent red (danger): `#FF3B3B`
- Accent orange (warning): `#FF9800`
- Accent purple: `#7C3AED`

### Light Mode
- Background primary: `#F8FAFC`
- Background secondary: `#FFFFFF`
- Background card: `#FFFFFF`
- Background elevated: `#F1F5F9`
- Border: `#E2E8F0`
- Text primary: `#0F172A`
- Text secondary: `#475569`
- Text muted: `#94A3B8`
- Accent cyan: `#0284C7`
- Accent green: `#16A34A`
- Accent red: `#DC2626`
- Accent orange: `#EA580C`

## Typography
- **Display/Headers**: `Space Grotesk` (700, 800)
- **Body**: `Inter` (400, 500, 600)
- **Mono/Code/Data**: `JetBrains Mono` (for IPs, ports, hex values)
- Scale: 12/14/16/18/24/32/48/64px

## Layout
- Max width: 1280px
- Sidebar: 240px (dashboard)
- Grid: 12-col
- Spacing unit: 4px base (8, 12, 16, 24, 32, 48, 64)
- Border radius: 8px cards, 12px modals, 4px badges

## Components
- **Score ring**: animated circular progress, color shifts green→orange→red
- **Alert badge**: pill with severity color + icon
- **Device card**: IP, MAC, OS icon, risk level, online status dot
- **Stat card**: icon + number + trend arrow
- **Chart**: area chart for traffic, bar for events
- **Terminal-style log**: monospace, dark bg, cyan text

## Motion
- Page transitions: fade + slide up 200ms
- Cards: hover lift (translateY -2px) + shadow
- Score ring: animate on mount (0 → value, 1.2s ease-out)
- Alerts: slide in from right
- Dark/Light toggle: smooth 300ms transition

## Anti-patterns to avoid
- No purple gradients on white
- No generic rounded card grids
- No Roboto font
- No flat icon-only dashboards without data density
