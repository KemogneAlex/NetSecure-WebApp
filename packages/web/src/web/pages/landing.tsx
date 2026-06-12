import { Link } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import {
  Shield, Eye, Lock, Bell, BarChart3,
  CheckCircle, Sun, Moon, ArrowRight,
  AlertTriangle, Activity, Wifi, ChevronRight, Zap
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

// Logo SVG custom
function NetSecureLogo({ size = 32, color = "#10B981" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2L4 7.5V16c0 6.627 5.373 12 12 12s12-5.373 12-12V7.5L16 2z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 6L8 9.75V16c0 4.418 3.582 8 8 8s8-3.582 8-8V9.75L16 6z"
        fill={color}
        fillOpacity="0.2"
      />
      <path d="M12 16l2.5 2.5L20 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const [scrolled, setScrolled] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView();

  const threats = useCountUp(24780, 2000, statsInView);
  const uptime = useCountUp(999, 2000, statsInView);
  const customers = useCountUp(1240, 2000, statsInView);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Fonctionnalités", "Comment ça marche", "Tarifs"];

  return (
    <div style={{
      background: c.bg, color: c.textPrimary,
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh", overflowX: "hidden",
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled
          ? theme === "dark" ? "rgba(8,12,18,0.92)" : "rgba(249,250,251,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${c.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "0 40px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NetSecureLogo size={30} color={c.accent} />
          <span style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px",
            color: c.textPrimary,
          }}>Net<span style={{ color: c.accent }}>Secure</span></span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map(link => (
            <button key={link} style={{
              background: "transparent", border: "none",
              padding: "8px 16px", cursor: "pointer",
              color: c.textSecondary, fontSize: 14, fontWeight: 500,
              borderRadius: 8, transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = c.textPrimary)}
              onMouseLeave={e => (e.currentTarget.style.color = c.textSecondary)}
            >{link}</button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggle} style={{
            background: "transparent", border: `1px solid ${c.border}`,
            borderRadius: 8, padding: "7px 9px", cursor: "pointer",
            color: c.textMuted, display: "flex", alignItems: "center",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textMuted; }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/login">
            <button style={{
              background: "transparent", border: `1px solid ${c.border}`,
              borderRadius: 8, padding: "8px 20px", cursor: "pointer",
              color: c.textSecondary, fontSize: 13, fontWeight: 500,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.textPrimary; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
            >Connexion</button>
          </Link>
          <Link to="/register">
            <button style={{
              background: c.accent,
              border: "none", borderRadius: 8, padding: "8px 20px",
              cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600,
              transition: "background 0.2s",
              letterSpacing: "0.2px",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = c.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = c.accent)}
            >Essai gratuit</button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 140, paddingBottom: 100,
        paddingLeft: 40, paddingRight: 40,
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 80, alignItems: "center",
        position: "relative",
      }}>
        {/* Ambient bg */}
        <div style={{
          position: "absolute", top: 60, left: "50%",
          width: 600, height: 600,
          background: `radial-gradient(circle, ${c.accent}12 0%, transparent 70%)`,
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />

        {/* Left */}
        <div style={{ position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px 5px 8px",
            background: c.accentDim,
            border: `1px solid ${c.accent}25`,
            borderRadius: 6, marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, boxShadow: `0 0 6px ${c.accent}` }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: c.accent, letterSpacing: "0.5px" }}>
              SURVEILLANCE EN TEMPS RÉEL
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            fontSize: "clamp(2.6rem, 5vw, 4rem)",
            fontWeight: 800, lineHeight: 1.08,
            color: c.textPrimary, marginBottom: 20,
            letterSpacing: "-1.5px",
          }}>
            Votre réseau,<br />
            <span style={{ color: c.accent }}>sous contrôle.</span>
          </h1>

          <p style={{
            fontSize: 16, color: c.textSecondary,
            lineHeight: 1.75, marginBottom: 36,
            maxWidth: 460,
          }}>
            NetSecure détecte les intrusions, bloque les menaces et vous alerte en temps réel.
            La cybersécurité enterprise, accessible aux PME.
          </p>

          {/* Trust points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
            {[
              "Aucune expertise technique requise",
              "Opérationnel en moins de 5 minutes",
              "14 jours d'essai gratuit, sans carte",
            ].map(text => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={15} color={c.accent} />
                <span style={{ fontSize: 14, color: c.textSecondary }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/dashboard">
              <button style={{
                background: c.accent, border: "none",
                borderRadius: 10, padding: "13px 28px",
                cursor: "pointer", color: "#fff",
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s",
                boxShadow: `0 4px 20px ${c.accent}35`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.accentHover; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                Voir le dashboard <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/pricing">
              <button style={{
                background: "transparent",
                border: `1px solid ${c.border}`,
                borderRadius: 10, padding: "13px 24px",
                cursor: "pointer", color: c.textSecondary,
                fontSize: 15, fontWeight: 500,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.color = c.textPrimary; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
              >Voir les tarifs</button>
            </Link>
          </div>
        </div>

        {/* Right — dashboard preview card */}
        <div style={{ position: "relative" }}>
          {/* Glow behind card */}
          <div style={{
            position: "absolute", inset: -30,
            background: `radial-gradient(ellipse, ${c.accent}10 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          {/* Card principale */}
          <div style={{
            background: c.bgCard,
            border: `1px solid ${c.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: theme === "dark"
              ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${c.border}`
              : `0 32px 80px rgba(0,0,0,0.08), 0 0 0 1px ${c.border}`,
            position: "relative",
          }}>
            {/* Header card */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: c.textMuted, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 4 }}>SCORE DE SÉCURITÉ</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: c.accent }}>72</div>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: `3px solid ${c.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: c.accentDim,
              }}>
                <Shield size={24} color={c.accent} />
              </div>
            </div>

            {/* Mini alert items */}
            {[
              { dot: c.red, label: "Tentative d'intrusion", time: "il y a 2min", severity: "CRITIQUE" },
              { dot: c.orange, label: "Scan de ports détecté", time: "il y a 1h", severity: "ÉLEVÉ" },
              { dot: c.accent, label: "8 appareils connectés", time: "Actif", severity: "INFO" },
            ].map(({ dot, label, time, severity }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10,
                background: c.bgElevated,
                marginBottom: 8, border: `1px solid ${c.borderSubtle}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0, boxShadow: `0 0 6px ${dot}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: c.textPrimary, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>{time}</div>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: dot,
                  background: `${dot}12`, padding: "2px 8px",
                  borderRadius: 4, letterSpacing: "0.5px",
                }}>{severity}</div>
              </div>
            ))}

            {/* Mini trafic bars */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: c.textMuted, marginBottom: 8, letterSpacing: "0.5px" }}>TRAFIC RÉSEAU — 24H</div>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
                {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7, 0.5, 0.8, 0.6, 0.4, 0.7].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h * 100}%`,
                    background: i === 6
                      ? c.red
                      : `${c.accent}${Math.floor(40 + h * 100).toString(16)}`,
                    borderRadius: 3,
                    transition: "height 0.3s",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: "absolute", bottom: -16, left: -20,
            background: c.bgCard, border: `1px solid ${c.border}`,
            borderRadius: 12, padding: "10px 16px",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: c.textPrimary }}>Réseau protégé</span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef}>
        <section style={{
          background: c.bgCard,
          borderTop: `1px solid ${c.border}`,
          borderBottom: `1px solid ${c.border}`,
          padding: "40px",
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
          }}>
            {[
              { value: `${threats.toLocaleString()}+`, label: "Menaces bloquées", sub: "ce mois", color: c.red },
              { value: `${(uptime / 10).toFixed(1)}%`, label: "Disponibilité", sub: "garantie SLA", color: c.accent },
              { value: `${customers.toLocaleString()}+`, label: "Entreprises", sub: "protégées", color: c.blue },
            ].map(({ value, label, sub, color }, i) => (
              <div key={label} style={{
                textAlign: "center", padding: "24px 0",
                borderRight: i < 2 ? `1px solid ${c.border}` : "none",
              }}>
                <div style={{
                  fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                  fontSize: 38, fontWeight: 800, color, lineHeight: 1,
                  letterSpacing: "-1px",
                }}>{value}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary, marginTop: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>
            FONCTIONNALITÉS
          </div>
          <h2 style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 800, color: c.textPrimary,
            letterSpacing: "-0.8px", lineHeight: 1.1,
            maxWidth: 480,
          }}>
            Tout ce dont une PME a besoin pour se protéger
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>
          {[
            { icon: Eye, title: "Visibilité totale", desc: "Tous les appareils de votre réseau visibles en temps réel. Détectez immédiatement ce qui ne devrait pas être là.", color: c.accent, tag: "Monitoring" },
            { icon: Bell, title: "Alertes intelligentes", desc: "Notifications par email et SMS filtrées par criticité. Zéro bruit, uniquement ce qui compte vraiment.", color: c.orange, tag: "Alertes" },
            { icon: Lock, title: "Blocage en 1 clic", desc: "Isolez un appareil suspect instantanément depuis le dashboard. Aucune ligne de commande nécessaire.", color: c.red, tag: "Firewall" },
            { icon: Activity, title: "Analyse du trafic", desc: "Graphiques de trafic 24h en temps réel. Identifiez les pics anormaux avant qu'ils ne deviennent des incidents.", color: c.blue, tag: "Réseau" },
            { icon: AlertTriangle, title: "Score de sécurité", desc: "Un indicateur 0-100 calculé en continu. Sachez en 3 secondes si votre entreprise est exposée.", color: c.purple, tag: "Score" },
            { icon: BarChart3, title: "Rapports automatiques", desc: "Rapports PDF hebdomadaires et mensuels générés automatiquement. Prêts pour votre direction ou audit.", color: c.accent, tag: "Rapports" },
          ].map(({ icon: Icon, title, desc, color, tag }, i) => (
            <div key={title} style={{
              background: c.bgCard,
              padding: "32px 28px",
              borderRight: i % 3 < 2 ? `1px solid ${c.border}` : "none",
              borderBottom: i < 3 ? `1px solid ${c.border}` : "none",
              transition: "background 0.25s",
              cursor: "default",
              position: "relative",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = c.bgElevated}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = c.bgCard}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: 10,
                background: `${color}12`, marginBottom: 16,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{
                position: "absolute", top: 28, right: 24,
                fontSize: 10, fontWeight: 700, color: color,
                letterSpacing: "0.8px",
                background: `${color}12`,
                padding: "2px 8px", borderRadius: 4,
              }}>{tag}</div>
              <h3 style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 16, fontWeight: 700,
                color: c.textPrimary, marginBottom: 8,
                letterSpacing: "-0.3px",
              }}>{title}</h3>
              <p style={{ fontSize: 13, color: c.textSecondary, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        background: c.bgSecondary,
        borderTop: `1px solid ${c.border}`,
        borderBottom: `1px solid ${c.border}`,
        padding: "100px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: c.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>
              COMMENT ÇA MARCHE
            </div>
            <h2 style={{
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 800, color: c.textPrimary,
              letterSpacing: "-0.8px",
            }}>
              Opérationnel en 5 minutes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, position: "relative" }}>
            {/* Ligne connecteur */}
            <div style={{
              position: "absolute", top: 20, left: "16%", right: "16%", height: 1,
              background: `linear-gradient(90deg, ${c.accent}, ${c.blue})`,
              opacity: 0.3,
            }} />

            {[
              { num: "01", icon: Wifi, title: "Installez l'agent", desc: "Téléchargez l'agent léger (Windows, Mac, Linux, Docker). Installation en moins de 2 minutes." },
              { num: "02", icon: Eye, title: "Détection automatique", desc: "L'agent scanne et identifie tous les appareils de votre réseau. Synchronisation instantanée avec votre dashboard." },
              { num: "03", icon: Shield, title: "Surveillez & agissez", desc: "Accédez à votre dashboard depuis n'importe où. Recevez des alertes et bloquez les menaces en un clic." },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: c.accentDim,
                    border: `1px solid ${c.accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color={c.accent} />
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: c.textMuted,
                    fontWeight: 600, letterSpacing: "1px",
                  }}>ÉTAPE {num}</div>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                  fontSize: 18, fontWeight: 700,
                  color: c.textPrimary, marginBottom: 10,
                  letterSpacing: "-0.3px",
                }}>{title}</h3>
                <p style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>
            TARIFS
          </div>
          <h2 style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 800, color: c.textPrimary,
            letterSpacing: "-0.8px",
          }}>
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
              name: "Pro", price: "29€", period: "/mois", badge: "POPULAIRE",
              features: ["3 réseaux", "Appareils illimités", "Alertes avancées", "Rapports automatiques", "Support prioritaire"],
              cta: "Essai 14 jours gratuit", highlight: true,
            },
            {
              name: "Business", price: "99€", period: "/mois", badge: null,
              features: ["Sites illimités", "Appareils illimités", "API complète", "Multi-utilisateurs", "SLA 99.9%", "Support dédié"],
              cta: "Contacter les ventes", highlight: false,
            },
          ].map(({ name, price, period, badge, features, cta, highlight }) => (
            <div key={name} style={{
              background: highlight ? c.bgCard : c.bgCard,
              border: highlight ? `1.5px solid ${c.accent}` : `1px solid ${c.border}`,
              borderRadius: 16, padding: "32px 28px",
              position: "relative",
              boxShadow: highlight ? `0 16px 48px ${c.accent}15` : "none",
            }}>
              {badge && (
                <div style={{
                  position: "absolute", top: -10, left: 24,
                  background: c.accent, padding: "3px 12px",
                  borderRadius: 5, fontSize: 10, fontWeight: 800,
                  color: "#fff", letterSpacing: "1px",
                }}>{badge}</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.textSecondary, marginBottom: 6 }}>{name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 36, fontWeight: 800,
                    color: highlight ? c.accent : c.textPrimary,
                    letterSpacing: "-1px",
                  }}>{price}</span>
                  <span style={{ fontSize: 13, color: c.textMuted }}>{period}</span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 20, marginBottom: 24 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 11 }}>
                    <CheckCircle size={15} color={c.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: c.textSecondary, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <button style={{
                  width: "100%", padding: "12px 0",
                  background: highlight ? c.accent : "transparent",
                  border: highlight ? "none" : `1px solid ${c.border}`,
                  borderRadius: 9, cursor: "pointer",
                  color: highlight ? "#fff" : c.textSecondary,
                  fontSize: 14, fontWeight: 600,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    if (!highlight) {
                      (e.currentTarget as HTMLElement).style.borderColor = c.accent;
                      (e.currentTarget as HTMLElement).style.color = c.textPrimary;
                    } else {
                      (e.currentTarget as HTMLElement).style.background = c.accentHover;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!highlight) {
                      (e.currentTarget as HTMLElement).style.borderColor = c.border;
                      (e.currentTarget as HTMLElement).style.color = c.textSecondary;
                    } else {
                      (e.currentTarget as HTMLElement).style.background = c.accent;
                    }
                  }}
                >{cta}</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{
        padding: "80px 40px",
        borderTop: `1px solid ${c.border}`,
        background: c.bgSecondary,
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 60, height: 60, borderRadius: 16,
            background: c.accentDim, border: `1px solid ${c.accent}25`,
            marginBottom: 24,
          }}>
            <Shield size={28} color={c.accent} />
          </div>
          <h2 style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
            fontWeight: 800, color: c.textPrimary,
            letterSpacing: "-0.8px", marginBottom: 14,
          }}>
            Protégez votre réseau dès aujourd'hui
          </h2>
          <p style={{ fontSize: 15, color: c.textSecondary, lineHeight: 1.7, marginBottom: 32 }}>
            14 jours d'essai gratuit. Aucune carte bancaire. Opérationnel en 5 minutes.
          </p>
          <Link to="/dashboard">
            <button style={{
              background: c.accent, border: "none",
              borderRadius: 10, padding: "14px 36px",
              cursor: "pointer", color: "#fff",
              fontSize: 15, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: `0 8px 28px ${c.accent}30`,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.accentHover; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Voir la démo live <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: c.bg,
        borderTop: `1px solid ${c.border}`,
        padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NetSecureLogo size={22} color={c.accent} />
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 14, color: c.textSecondary,
          }}>Net<span style={{ color: c.textPrimary }}>Secure</span></span>
        </div>
        <div style={{ fontSize: 12, color: c.textMuted }}>© 2026 NetSecure. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Confidentialité", "CGU", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: c.textMuted, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = c.textSecondary)}
              onMouseLeave={e => (e.currentTarget.style.color = c.textMuted)}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
