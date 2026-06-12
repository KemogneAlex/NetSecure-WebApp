import { Link } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import {
  Shield, Zap, Eye, Lock, Bell, BarChart3, ChevronRight,
  CheckCircle, Sun, Moon, ArrowRight, Wifi, AlertTriangle, Activity
} from "lucide-react";
import { useState, useEffect } from "react";

function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;

  const threats = useCountUp(24780);
  const uptime = useCountUp(99);
  const customers = useCountUp(1240);

  return (
    <div style={{ background: c.bg, color: c.textPrimary, fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(10,14,26,0.9)" : "rgba(248,250,252,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${c.border}`,
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: c.textPrimary }}>NetSecure</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggle} style={{
            background: "transparent", border: `1px solid ${c.border}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: c.textSecondary,
            display: "flex", alignItems: "center",
          }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login">
            <button style={{
              background: "transparent", border: `1px solid ${c.border}`,
              borderRadius: 8, padding: "8px 18px", cursor: "pointer",
              color: c.textSecondary, fontSize: 14, fontWeight: 500,
            }}>Connexion</button>
          </Link>
          <Link to="/dashboard">
            <button style={{
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              border: "none", borderRadius: 8, padding: "8px 18px",
              cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 600,
            }}>Essai gratuit</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "100px 32px 80px",
        textAlign: "center",
        background: theme === "dark"
          ? `radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%), ${c.bg}`
          : `radial-gradient(ellipse at 50% 0%, rgba(2,132,199,0.06) 0%, transparent 60%), ${c.bg}`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(${c.accent} 1px, transparent 1px), linear-gradient(90deg, ${c.accent} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 20,
            background: `${c.accent}15`, border: `1px solid ${c.accent}30`,
            fontSize: 13, color: c.accent, fontWeight: 600, marginBottom: 24,
          }}>
            <Zap size={14} /> Surveillance réseau en temps réel
          </div>

          <h1 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800, lineHeight: 1.1,
            color: c.textPrimary, marginBottom: 24,
          }}>
            Votre réseau.<br />
            <span style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sous contrôle.
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: c.textSecondary, lineHeight: 1.7,
            maxWidth: 560, margin: "0 auto 40px",
          }}>
            NetSecure surveille votre réseau 24/7, détecte les intrusions en temps réel et vous alerte avant qu'il ne soit trop tard. L'expert cybersécurité automatisé pour votre entreprise.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dashboard">
              <button style={{
                background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
                border: "none", borderRadius: 12, padding: "14px 32px",
                cursor: "pointer", color: "#fff", fontSize: 16, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: `0 8px 32px ${c.accent}30`,
              }}>
                Voir le Dashboard <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/pricing">
              <button style={{
                background: "transparent", border: `1px solid ${c.border}`,
                borderRadius: 12, padding: "14px 32px",
                cursor: "pointer", color: c.textPrimary, fontSize: 16, fontWeight: 600,
              }}>
                Voir les tarifs
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: c.bgCard, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`,
        padding: "32px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: threats.toLocaleString(), label: "Menaces bloquées ce mois", color: c.red },
            { value: `${uptime}.9%`, label: "Disponibilité garantie", color: c.green },
            { value: `${customers.toLocaleString()}+`, label: "Entreprises protégées", color: c.accent },
          ].map(({ value, label, color }) => (
            <div key={label}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 13, color: c.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>FONCTIONNALITÉS</div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: c.textPrimary }}>
            Tout ce dont vous avez besoin
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            { icon: Eye, title: "Surveillance temps réel", desc: "Voyez tous les appareils connectés à votre réseau en temps réel. Détectez immédiatement les intrus.", color: c.accent },
            { icon: Bell, title: "Alertes instantanées", desc: "Notifications immédiates par email et SMS dès qu'une activité suspecte est détectée sur votre réseau.", color: c.orange },
            { icon: Lock, title: "Gestion pare-feu", desc: "Bloquez les appareils suspects en un clic. Configurez des règles de sécurité sans expertise technique.", color: c.red },
            { icon: Activity, title: "Analyse du trafic", desc: "Visualisez le trafic entrant et sortant en temps réel. Détectez les anomalies et pics suspects.", color: c.green },
            { icon: AlertTriangle, title: "Score de sécurité", desc: "Un score 0-100 clair vous indique l'état de votre sécurité. Sachez en 5 secondes si vous êtes en danger.", color: c.purple },
            { icon: BarChart3, title: "Rapports détaillés", desc: "Rapports hebdomadaires et mensuels automatiques. Historique complet de tous les événements de sécurité.", color: c.accent },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{
              background: c.bgCard, border: `1px solid ${c.border}`,
              borderRadius: 16, padding: 28,
              transition: "all 0.3s",
              cursor: "default",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color}20`;
                (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = c.border;
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${color}15`, border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: c.textPrimary, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 32px", background: c.bgSecondary, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: c.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>COMMENT ÇA MARCHE</div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: c.textPrimary, marginBottom: 60 }}>
            Opérationnel en 5 minutes
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { step: "01", title: "Installez l'agent", desc: "Téléchargez et installez notre agent léger sur votre réseau (Windows, Mac, Linux, Docker)." },
              { step: "02", title: "Connectez votre réseau", desc: "L'agent détecte automatiquement tous les appareils de votre réseau et les synchronise avec votre dashboard." },
              { step: "03", title: "Surveillez & protégez", desc: "Accédez à votre dashboard depuis n'importe où et recevez des alertes en temps réel." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700, color: "#fff",
                  margin: "0 auto 16px",
                }}>{step}</div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: c.textPrimary, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section style={{ padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 13, color: c.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>TARIFS</div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: c.textPrimary }}>
            Simple et transparent
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            {
              name: "Free", price: "0€", period: "/mois",
              features: ["1 réseau", "10 appareils max", "Alertes basiques", "Dashboard limité"],
              highlight: false, cta: "Commencer gratuitement",
            },
            {
              name: "Pro", price: "29€", period: "/mois",
              features: ["3 réseaux", "Appareils illimités", "Alertes avancées", "Rapports automatiques", "Support prioritaire"],
              highlight: true, cta: "Essai 14 jours gratuit",
            },
            {
              name: "Business", price: "99€", period: "/mois",
              features: ["Sites illimités", "Appareils illimités", "API complète", "Multi-utilisateurs", "SLA 99.9%", "Support dédié"],
              highlight: false, cta: "Contacter les ventes",
            },
          ].map(({ name, price, period, features, highlight, cta }) => (
            <div key={name} style={{
              background: highlight ? `linear-gradient(135deg, ${c.accent}15, ${c.purple}10)` : c.bgCard,
              border: `2px solid ${highlight ? c.accent : c.border}`,
              borderRadius: 20, padding: 32,
              position: "relative",
              transform: highlight ? "scale(1.03)" : "scale(1)",
              boxShadow: highlight ? `0 20px 60px ${c.accent}20` : "none",
            }}>
              {highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
                  padding: "4px 16px", borderRadius: 20,
                  fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap",
                }}>PLUS POPULAIRE</div>
              )}
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 700, color: c.textPrimary, marginBottom: 8 }}>{name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 40, fontWeight: 800, color: highlight ? c.accent : c.textPrimary }}>{price}</span>
                <span style={{ color: c.textMuted, fontSize: 14 }}>{period}</span>
              </div>
              <div style={{ marginBottom: 28 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <CheckCircle size={16} color={highlight ? c.accent : c.green} />
                    <span style={{ fontSize: 14, color: c.textSecondary }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/register">
                <button style={{
                  width: "100%", padding: "12px",
                  background: highlight ? `linear-gradient(135deg, ${c.accent}, ${c.purple})` : "transparent",
                  border: highlight ? "none" : `1px solid ${c.border}`,
                  borderRadius: 10, cursor: "pointer",
                  color: highlight ? "#fff" : c.textPrimary,
                  fontSize: 14, fontWeight: 600,
                }}>{cta}</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 32px",
        background: theme === "dark"
          ? `linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1))`
          : `linear-gradient(135deg, rgba(2,132,199,0.05), rgba(124,58,237,0.05))`,
        borderTop: `1px solid ${c.border}`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: c.textPrimary, marginBottom: 16 }}>
            Protégez votre réseau aujourd'hui
          </h2>
          <p style={{ color: c.textSecondary, fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            14 jours d'essai gratuit. Aucune carte bancaire requise. Opérationnel en 5 minutes.
          </p>
          <Link to="/dashboard">
            <button style={{
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              border: "none", borderRadius: 12, padding: "16px 40px",
              cursor: "pointer", color: "#fff", fontSize: 16, fontWeight: 700,
              boxShadow: `0 8px 32px ${c.accent}40`,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Voir la démo live <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: c.bgSecondary, borderTop: `1px solid ${c.border}`,
        padding: "32px", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <Shield size={16} color={c.accent} />
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: c.textPrimary }}>NetSecure</span>
        </div>
        <p style={{ fontSize: 13, color: c.textMuted }}>© 2026 NetSecure. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
