import { Link } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import {
  Shield, Eye, Lock, Bell, BarChart3,
  CheckCircle, Sun, Moon, ArrowRight,
  AlertTriangle, Activity, Wifi,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ── Une seule famille de police (Tip 31) ──────────────────────
const FONT = "'Plus Jakarta Sans', sans-serif";

// ── Échelle typographique réduite (Tip 13) ──────────────────────
// 4 tailles seulement : display / heading / body / small
const T = {
  display: "clamp(2.4rem, 4.5vw, 3.6rem)",
  heading:  "clamp(1.6rem, 3vw, 2.2rem)",
  body:     "1rem",        // 16px — jamais moins (Tip 86)
  small:    "0.875rem",    // 14px — minimum absolu (Tip 86)
};

function useCountUp(target: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let cur = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return val;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function NetSecureLogo({ size = 32, color = "#10B981" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2L4 7.5V16c0 6.627 5.373 12 12 12s12-5.373 12-12V7.5L16 2z"
        fill={color} fillOpacity="0.15"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M16 6L8 9.75V16c0 4.418 3.582 8 8 8s8-3.582 8-8V9.75L16 6z" fill={color} fillOpacity="0.2" />
      <path d="M12 16l2.5 2.5L20 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const [scrolled, setScrolled] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView();

  const threats  = useCountUp(24780, 2000, statsInView);
  const uptime   = useCountUp(999,   2000, statsInView);
  const customers = useCountUp(1240,  2000, statsInView);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Fonctionnalités", "Comment ça marche", "Tarifs"];

  // ── Shared style helpers ─────────────────────────────────────
  const pill = (color: string) => ({
    background: `${color}15`,
    border: `1px solid ${color}28`,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: "0.7rem",
    fontWeight: 700 as const,
    color,
    letterSpacing: "0.4px",
  });

  const btnPrimary = {
    background: c.accent,
    border: "none",
    borderRadius: 10,
    // Tip 51 — side padding = 2× vertical padding  (14px → 28px)
    padding: "14px 36px",
    cursor: "pointer" as const,
    color: "#fff",
    fontSize: T.small,
    fontWeight: 700 as const,
    fontFamily: FONT,
    display: "inline-flex" as const,
    alignItems: "center" as const,
    gap: 8,
    boxShadow: `0 6px 24px ${c.accent}30`,
    transition: "all 0.2s",
    letterSpacing: "0.1px",
  };

  const btnOutline = {
    background: "transparent",
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    padding: "14px 28px",
    cursor: "pointer" as const,
    color: c.textSecondary,
    fontSize: T.small,
    fontWeight: 500 as const,
    fontFamily: FONT,
    transition: "all 0.2s",
  };

  return (
    <div style={{ background: c.bg, color: c.textPrimary, fontFamily: FONT, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled
          ? theme === "dark" ? "rgba(8,12,18,0.93)" : "rgba(249,250,251,0.93)"
          : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${c.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "0 48px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo — une seule fois (Tip 42) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NetSecureLogo size={28} color={c.accent} />
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.2px", color: c.textPrimary }}>
            Net<span style={{ color: c.accent }}>Secure</span>
          </span>
        </div>

        {/* Tip 92 — items inactifs plus discrets pour faire ressortir les actifs */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map(link => (
            <button key={link} style={{
              background: "transparent", border: "none",
              padding: "8px 16px", cursor: "pointer",
              color: c.textMuted, fontSize: T.small, fontWeight: 500, fontFamily: FONT,
              borderRadius: 8, transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = c.textPrimary)}
              onMouseLeave={e => (e.currentTarget.style.color = c.textMuted)}
            >{link}</button>
          ))}
        </div>

        {/* Tip 30 — hiérarchie claire : ghost → outline → primary */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggle} style={{
            background: "transparent", border: `1px solid ${c.border}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
            color: c.textMuted, display: "flex", alignItems: "center",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textMuted; }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/login">
            <button style={{ ...btnOutline, padding: "8px 20px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.textPrimary; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
            >Connexion</button>
          </Link>
          <Link to="/register">
            {/* Tip 28 — CTA en couleur primaire */}
            <button style={{ ...btnPrimary, padding: "8px 20px", boxShadow: "none" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = c.accent)}
            >Essai gratuit</button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 148, paddingBottom: 100,
        paddingLeft: 48, paddingRight: 48,
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 72, alignItems: "center",
        position: "relative",
      }}>
        {/* Ambient glow discret */}
        <div style={{
          position: "absolute", top: 80, left: "40%",
          width: 500, height: 500,
          background: `radial-gradient(circle, ${c.accent}0D 0%, transparent 70%)`,
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />

        {/* Gauche */}
        <div style={{ position: "relative" }}>
          {/* Badge — court, pas tout en majuscules (Tip 87) */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px 5px 8px",
            background: c.accentDim,
            border: `1px solid ${c.accent}22`,
            borderRadius: 6, marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, boxShadow: `0 0 6px ${c.accent}` }} />
            {/* Tip 87 — pas de ALL CAPS en continu sur du texte */}
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: c.accent, letterSpacing: "0.3px" }}>
              Surveillance réseau en temps réel
            </span>
          </div>

          {/* Tip 13 — taille display, poids 800, max 2 lignes */}
          <h1 style={{
            fontSize: T.display,
            fontWeight: 800, lineHeight: 1.1,
            color: c.textPrimary, marginBottom: 24,
            letterSpacing: "-1.2px",
            // Tip 35 — limite largeur pour lignes lisibles
            maxWidth: "14ch",
          }}>
            Votre réseau,{" "}
            <span style={{ color: c.accent }}>sous contrôle.</span>
          </h1>

          {/* Tip 35 / Tip 94 — max ~65 caractères par ligne */}
          <p style={{
            fontSize: T.body,
            color: c.textSecondary,
            lineHeight: 1.75, marginBottom: 36,
            maxWidth: "52ch",
          }}>
            NetSecure détecte les intrusions, bloque les menaces et vous alerte instantanément.
            La cybersécurité enterprise, accessible aux PME.
          </p>

          {/* Points de confiance */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {[
              "Aucune expertise technique requise",
              "Opérationnel en moins de 5 minutes",
              "14 jours d'essai gratuit — sans carte bancaire",
            ].map(text => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={16} color={c.accent} />
                {/* Tip 86 — body text ≥ 14px */}
                <span style={{ fontSize: T.small, color: c.textSecondary }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Tip 28 + Tip 51 — CTA primary bien visible, padding 2:1 */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <button style={btnPrimary}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.accentHover; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {/* Tip 57 — bouton dit exactement ce qu'il fait */}
                Démarrer l'essai gratuit <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/dashboard">
              <button style={btnOutline}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.textPrimary; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
              >Voir la démo</button>
            </Link>
          </div>
        </div>

        {/* Droite — Dashboard preview */}
        <div style={{ position: "relative" }}>
          {/* Tip 84 — shadow douce : low opacity, high blur */}
          <div style={{
            background: c.bgCard,
            border: `1px solid ${c.border}`,
            borderRadius: 18,
            padding: 24,
            boxShadow: theme === "dark"
              ? "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 24px 60px rgba(0,0,0,0.07)",
            position: "relative",
          }}>
            {/* Header card */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: c.textMuted, fontWeight: 600, letterSpacing: "0.6px", marginBottom: 4, textTransform: "uppercase" as const }}>Score de sécurité</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: c.accent, lineHeight: 1 }}>72</div>
              </div>
              {/* Tip 55 — accent couleur utilisé uniquement sur élément clé */}
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: `2px solid ${c.accent}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: c.accentDim,
              }}>
                <Shield size={22} color={c.accent} />
              </div>
            </div>

            {/* Alertes */}
            {[
              { dot: c.red,    label: "Tentative d'intrusion",  time: "il y a 2min", severity: "Critique" },
              { dot: c.orange, label: "Scan de ports détecté",  time: "il y a 1h",   severity: "Élevé"    },
              { dot: c.accent, label: "8 appareils connectés",  time: "Actif",        severity: "Info"     },
            ].map(({ dot, label, time, severity }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                // Tip 21 — couche supérieure = couleur différente du fond de card
                background: c.bgElevated,
                marginBottom: 8, border: `1px solid ${c.borderSubtle}`,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: T.small, color: c.textPrimary, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: "0.72rem", color: c.textMuted, marginTop: 2 }}>{time}</div>
                </div>
                {/* Tip 75 — distinction colorée pour catégories */}
                <span style={pill(dot)}>{severity}</span>
              </div>
            ))}

            {/* Mini graph trafic */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: "0.7rem", color: c.textMuted, marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Trafic réseau — 24h</div>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
                {[0.3,0.5,0.4,0.8,0.6,0.9,0.7,0.5,0.8,0.6,0.4,0.7].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h * 100}%`,
                    background: i === 6 ? c.red : `${c.accent}${Math.floor(40 + h * 100).toString(16)}`,
                    borderRadius: 3,
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge bas-gauche */}
          <div style={{
            position: "absolute", bottom: -14, left: -18,
            background: c.bgCard, border: `1px solid ${c.border}`,
            borderRadius: 10, padding: "9px 14px",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.accent }} />
            <span style={{ fontSize: T.small, fontWeight: 600, color: c.textPrimary }}>Réseau protégé</span>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <div ref={statsRef}>
        <section style={{
          background: c.bgCard,
          borderTop: `1px solid ${c.border}`,
          borderBottom: `1px solid ${c.border}`,
          // Tip 22 — padding généreux
          padding: "48px",
        }}>
          <div style={{
            maxWidth: 880, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          }}>
            {[
              { value: `${threats.toLocaleString()}+`, label: "Menaces bloquées",  sub: "ce mois",      color: c.red },
              { value: `${(uptime / 10).toFixed(1)}%`, label: "Disponibilité",     sub: "garantie SLA", color: c.accent },
              { value: `${customers.toLocaleString()}+`, label: "Entreprises",     sub: "protégées",    color: c.blue },
            ].map(({ value, label, sub, color }, i) => (
              <div key={label} style={{
                textAlign: "center", padding: "8px 24px",
                borderRight: i < 2 ? `1px solid ${c.border}` : "none",
              }}>
                {/* Tip 13 — seul le chiffre est en taille display */}
                <div style={{ fontSize: T.heading, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.8px" }}>{value}</div>
                <div style={{ fontSize: T.small, fontWeight: 600, color: c.textPrimary, marginTop: 8 }}>{label}</div>
                <div style={{ fontSize: "0.8rem", color: c.textMuted, marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 56 }}>
          {/* Tip 87 — label court, pas tout en caps */}
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: c.accent, letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 14 }}>
            Fonctionnalités
          </div>
          <h2 style={{
            fontSize: T.heading, fontWeight: 800, color: c.textPrimary,
            letterSpacing: "-0.6px", lineHeight: 1.15,
            maxWidth: "26ch",
          }}>
            Tout ce dont une PME a besoin pour se protéger
          </h2>
        </div>

        {/* Tip 67 — gaps cohérents sur la grille */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden",
        }}>
          {[
            { icon: Eye,           title: "Visibilité totale",       desc: "Tous vos appareils visibles en temps réel. Détectez immédiatement ce qui ne devrait pas être là.",                  color: c.accent,  tag: "Monitoring" },
            { icon: Bell,          title: "Alertes intelligentes",    desc: "Notifications par email et SMS filtrées par criticité. Zéro bruit, uniquement ce qui compte.",                      color: c.orange,  tag: "Alertes"    },
            { icon: Lock,          title: "Blocage en 1 clic",        desc: "Isolez un appareil suspect instantanément depuis le dashboard. Aucune ligne de commande nécessaire.",               color: c.red,     tag: "Firewall"   },
            { icon: Activity,      title: "Analyse du trafic",        desc: "Graphiques 24h en temps réel. Identifiez les pics anormaux avant qu'ils ne deviennent des incidents.",              color: c.blue,    tag: "Réseau"     },
            { icon: AlertTriangle, title: "Score de sécurité",        desc: "Un indicateur 0–100 calculé en continu. Sachez en 3 secondes si votre entreprise est exposée.",                     color: c.purple,  tag: "Score"      },
            { icon: BarChart3,     title: "Rapports automatiques",    desc: "Rapports PDF hebdomadaires générés automatiquement — prêts pour votre direction ou audit.",                         color: c.accent,  tag: "Rapports"   },
          ].map(({ icon: Icon, title, desc, color, tag }, i) => (
            <div key={title} style={{
              background: c.bgCard,
              // Tip 22 — padding généreux
              padding: "36px 30px",
              borderRight: i % 3 < 2 ? `1px solid ${c.border}` : "none",
              borderBottom: i < 3    ? `1px solid ${c.border}` : "none",
              transition: "background 0.2s",
              position: "relative",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = c.bgElevated}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = c.bgCard}
            >
              {/* Tip 43 — inner radius < outer radius */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: 10,
                background: `${color}12`, marginBottom: 20,
              }}>
                <Icon size={19} color={color} />
              </div>
              <div style={{ position: "absolute", top: 32, right: 28 }}>
                <span style={pill(color)}>{tag}</span>
              </div>
              {/* Tip 13 — h3 = même taille que body mais fontWeight plus élevé */}
              <h3 style={{ fontSize: T.body, fontWeight: 700, color: c.textPrimary, marginBottom: 10, letterSpacing: "-0.2px" }}>{title}</h3>
              {/* Tip 86 — min 14px */}
              <p style={{ fontSize: T.small, color: c.textSecondary, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{
        background: c.bgSecondary,
        borderTop: `1px solid ${c.border}`,
        borderBottom: `1px solid ${c.border}`,
        padding: "100px 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: c.accent, letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 14 }}>
              Comment ça marche
            </div>
            <h2 style={{ fontSize: T.heading, fontWeight: 800, color: c.textPrimary, letterSpacing: "-0.6px" }}>
              Opérationnel en 5 minutes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, position: "relative" }}>
            {/* Connecteur */}
            <div style={{
              position: "absolute", top: 18, left: "16%", right: "16%", height: 1,
              background: `linear-gradient(90deg, ${c.accent}40, ${c.blue}40)`,
            }} />

            {[
              { num: "01", icon: Wifi,   title: "Installez l'agent",         desc: "Téléchargez l'agent léger (Windows, Mac, Linux, Docker). Installation en moins de 2 minutes." },
              { num: "02", icon: Eye,    title: "Détection automatique",     desc: "L'agent scanne et identifie tous les appareils de votre réseau. Synchronisation instantanée avec votre dashboard." },
              { num: "03", icon: Shield, title: "Surveillez et agissez",     desc: "Accédez à votre dashboard depuis n'importe où. Recevez des alertes et bloquez les menaces en un clic." },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: c.accentDim, border: `1px solid ${c.accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={17} color={c.accent} />
                  </div>
                  {/* Tip 31 — mono uniquement pour les numéros techniques */}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: c.textMuted, fontWeight: 500, letterSpacing: "1px" }}>
                    Étape {num}
                  </div>
                </div>
                <h3 style={{ fontSize: T.body, fontWeight: 700, color: c.textPrimary, marginBottom: 12, letterSpacing: "-0.2px" }}>{title}</h3>
                <p style={{ fontSize: T.small, color: c.textSecondary, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: c.accent, letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 14 }}>
            Tarifs
          </div>
          <h2 style={{ fontSize: T.heading, fontWeight: 800, color: c.textPrimary, letterSpacing: "-0.6px" }}>
            Simple et transparent
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              name: "Free", price: "0€", period: "/mois", badge: null,
              features: ["1 réseau", "10 appareils max", "Alertes basiques", "Dashboard limité"],
              cta: "Commencer gratuitement", highlight: false,
            },
            {
              name: "Pro", price: "29€", period: "/mois", badge: "Populaire",
              features: ["3 réseaux", "Appareils illimités", "Alertes avancées", "Rapports automatiques", "Support prioritaire"],
              cta: "Démarrer l'essai 14 jours", highlight: true,
            },
            {
              name: "Business", price: "99€", period: "/mois", badge: null,
              features: ["Sites illimités", "Appareils illimités", "API complète", "Multi-utilisateurs", "SLA 99.9%", "Support dédié"],
              cta: "Contacter l'équipe commerciale", highlight: false,
            },
          ].map(({ name, price, period, badge, features, cta, highlight }) => (
            <div key={name} style={{
              background: c.bgCard,
              // Tip 34 — plan Pro clairement différencié
              border: highlight ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
              borderRadius: 16, padding: "32px 28px",
              position: "relative",
              // Tip 88 — accent color pour catégoriser le plan vedette
              boxShadow: highlight ? `0 0 0 1px ${c.accent}20, 0 20px 56px ${c.accent}12` : "none",
              // Tip 21 — fond légèrement différent pour le plan vedette
              background: highlight
                ? theme === "dark" ? "#0D1F16" : "#f0fdf4"
                : c.bgCard,
            }}>
              {/* Tip 34 + Tip 88 — badge accent sur le meilleur plan */}
              {badge && (
                <div style={{
                  position: "absolute", top: -11, left: 24,
                  background: c.accent, padding: "3px 14px",
                  borderRadius: 6, fontSize: "0.72rem", fontWeight: 700,
                  color: "#fff", letterSpacing: "0.3px",
                }}>{badge}</div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: T.small, fontWeight: 600, color: c.textSecondary, marginBottom: 8 }}>{name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{
                    fontSize: "2rem", fontWeight: 800,
                    color: highlight ? c.accent : c.textPrimary,
                    letterSpacing: "-1px",
                  }}>{price}</span>
                  <span style={{ fontSize: "0.8rem", color: c.textMuted }}>{period}</span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 20, marginBottom: 28 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <CheckCircle size={15} color={c.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: T.small, color: c.textSecondary, lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                {/* Tip 57 — label de bouton explicite */}
                <button style={{
                  width: "100%", padding: "13px 0",
                  background: highlight ? c.accent : "transparent",
                  border: highlight ? "none" : `1px solid ${c.border}`,
                  borderRadius: 9, cursor: "pointer",
                  color: highlight ? "#fff" : c.textSecondary,
                  fontSize: T.small, fontWeight: 600, fontFamily: FONT,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    if (!highlight) { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.textPrimary; }
                    else (e.currentTarget as HTMLElement).style.background = c.accentHover;
                  }}
                  onMouseLeave={e => {
                    if (!highlight) { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }
                    else (e.currentTarget as HTMLElement).style.background = c.accent;
                  }}
                >{cta}</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section style={{
        padding: "88px 48px",
        borderTop: `1px solid ${c.border}`,
        background: c.bgSecondary,
      }}>
        {/* Tip 49 — Gutenberg : CTA en bas à droite de la zone Z */}
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: 14,
            background: c.accentDim, border: `1px solid ${c.accent}22`,
            marginBottom: 28,
          }}>
            <Shield size={26} color={c.accent} />
          </div>
          <h2 style={{
            fontSize: T.heading, fontWeight: 800, color: c.textPrimary,
            letterSpacing: "-0.6px", marginBottom: 16,
            // Tip 35 — largeur contrôlée
            maxWidth: "28ch", margin: "0 auto 16px",
          }}>
            Protégez votre réseau dès aujourd'hui
          </h2>
          <p style={{ fontSize: T.body, color: c.textSecondary, lineHeight: 1.7, marginBottom: 36, maxWidth: "44ch", margin: "0 auto 36px" }}>
            14 jours d'essai gratuit. Aucune carte bancaire. Opérationnel en 5 minutes.
          </p>
          <Link to="/register">
            {/* Tip 28 — CTA principal en couleur primaire */}
            <button style={btnPrimary}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.accentHover; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Démarrer l'essai gratuit <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        background: c.bg,
        borderTop: `1px solid ${c.border}`,
        padding: "28px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NetSecureLogo size={20} color={c.accent} />
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: c.textSecondary }}>
            Net<span style={{ color: c.textPrimary }}>Secure</span>
          </span>
        </div>
        <div style={{ fontSize: "0.8rem", color: c.textMuted }}>© 2026 NetSecure. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Confidentialité", "CGU", "Contact"].map(l => (
            <span key={l} style={{ fontSize: "0.8rem", color: c.textMuted, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = c.textSecondary)}
              onMouseLeave={e => (e.currentTarget.style.color = c.textMuted)}
            >{l}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}
