import { Link } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { Shield, Check, X, Zap, Building2, Rocket, ArrowLeft, Sun, Moon } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    period: "mois",
    description: "Parfait pour les petites structures",
    icon: Zap,
    color: "#00D4FF",
    features: [
      { label: "Jusqu'à 25 appareils", included: true },
      { label: "Surveillance réseau de base", included: true },
      { label: "Alertes email", included: true },
      { label: "Rapports mensuels", included: true },
      { label: "Détection d'intrusion", included: false },
      { label: "Analyse comportementale", included: false },
      { label: "API & intégrations", included: false },
      { label: "Support prioritaire", included: false },
      { label: "Rapports personnalisés", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    period: "mois",
    description: "Pour les PME en croissance",
    icon: Shield,
    color: "#7C3AED",
    badge: "Populaire",
    features: [
      { label: "Jusqu'à 100 appareils", included: true },
      { label: "Surveillance réseau avancée", included: true },
      { label: "Alertes email + SMS", included: true },
      { label: "Rapports hebdomadaires", included: true },
      { label: "Détection d'intrusion", included: true },
      { label: "Analyse comportementale", included: true },
      { label: "API & intégrations", included: false },
      { label: "Support prioritaire", included: false },
      { label: "Rapports personnalisés", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "mois",
    description: "Pour les grandes entreprises",
    icon: Building2,
    color: "#00E676",
    features: [
      { label: "Appareils illimités", included: true },
      { label: "Surveillance réseau complète", included: true },
      { label: "Alertes multi-canaux", included: true },
      { label: "Rapports en temps réel", included: true },
      { label: "Détection d'intrusion avancée", included: true },
      { label: "Analyse comportementale IA", included: true },
      { label: "API & intégrations", included: true },
      { label: "Support prioritaire 24/7", included: true },
      { label: "Rapports personnalisés", included: true },
    ],
  },
];

const faqs = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement." },
  { q: "Y a-t-il une période d'essai ?", a: "Oui, chaque plan bénéficie d'un essai gratuit de 14 jours sans engagement et sans carte bancaire." },
  { q: "Comment fonctionne la facturation ?", a: "La facturation est mensuelle ou annuelle (économisez 20%). Vous pouvez annuler à tout moment." },
  { q: "Mes données sont-elles sécurisées ?", a: "Toutes les données sont chiffrées en transit et au repos. Nous sommes conformes RGPD et hébergeons en Europe." },
];

export default function Pricing() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;

  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${c.bgSecondary}E0`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${c.border}`,
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: c.textPrimary }}>NetSecure</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, color: c.textMuted, fontSize: 14 }}>
            <ArrowLeft size={15} /> Retour
          </Link>
          <button onClick={toggle} style={{
            width: 36, height: 36, borderRadius: 8, border: `1px solid ${c.border}`,
            background: c.bgCard, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: c.textSecondary,
          }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              color: "#fff", border: "none", cursor: "pointer",
            }}>
              Démarrer gratuitement
            </button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 20,
            background: c.accentDim, border: `1px solid ${c.accent}30`,
            marginBottom: 20,
          }}>
            <Rocket size={14} color={c.accent} />
            <span style={{ fontSize: 13, color: c.accent, fontWeight: 600 }}>14 jours d'essai gratuit</span>
          </div>
          <h1 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 800, color: c.textPrimary,
            margin: "0 0 16px", lineHeight: 1.1,
          }}>
            Tarifs simples et transparents
          </h1>
          <p style={{ fontSize: 18, color: c.textSecondary, maxWidth: 520, margin: "0 auto" }}>
            Protégez votre réseau avec des fonctionnalités adaptées à chaque taille d'entreprise.
          </p>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 80 }}>
          {plans.map(plan => {
            const Icon = plan.icon;
            const isPro = plan.id === "pro";
            return (
              <div key={plan.id} style={{
                background: isPro
                  ? `linear-gradient(160deg, ${c.bgCard} 0%, ${c.bgElevated} 100%)`
                  : c.bgCard,
                border: `2px solid ${isPro ? plan.color + "60" : c.border}`,
                borderRadius: 20,
                padding: 28,
                position: "relative",
                transform: isPro ? "scale(1.03)" : "scale(1)",
                boxShadow: isPro ? `0 0 40px ${plan.color}20` : "none",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    padding: "5px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: `linear-gradient(90deg, ${plan.color}, #7C3AED)`,
                    color: "#fff",
                  }}>{plan.badge}</div>
                )}

                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${plan.color}18`, border: `1px solid ${plan.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon size={24} color={plan.color} />
                </div>

                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 700, color: c.textPrimary }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4, marginBottom: 20 }}>{plan.description}</div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                  <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 42, fontWeight: 800, color: plan.color }}>{plan.price}€</span>
                  <span style={{ fontSize: 14, color: c.textMuted }}>/{plan.period}</span>
                </div>

                <Link to="/login" style={{ textDecoration: "none", display: "block", marginBottom: 28 }}>
                  <button style={{
                    width: "100%", padding: "12px", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    background: isPro
                      ? `linear-gradient(135deg, ${plan.color}, #7C3AED)`
                      : "transparent",
                    color: isPro ? "#fff" : plan.color,
                    border: `2px solid ${plan.color}${isPro ? "00" : "60"}`,
                    transition: "all 0.2s",
                  }}>
                    Commencer l'essai gratuit
                  </button>
                </Link>

                <div style={{ height: 1, background: c.border, marginBottom: 24 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        background: f.included ? `${plan.color}18` : `${c.textMuted}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {f.included
                          ? <Check size={12} color={plan.color} strokeWidth={3} />
                          : <X size={12} color={c.textMuted} strokeWidth={3} />
                        }
                      </div>
                      <span style={{ fontSize: 13, color: f.included ? c.textSecondary : c.textMuted }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif", fontSize: 32, fontWeight: 700,
            color: c.textPrimary, textAlign: "center", margin: "0 0 40px",
          }}>Questions fréquentes</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqs.map(faq => (
              <div key={faq.q} style={{
                background: c.bgCard, border: `1px solid ${c.border}`,
                borderRadius: 12, padding: "20px 24px",
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center", marginTop: 80,
          background: `linear-gradient(135deg, ${c.bgCard} 0%, ${c.bgElevated} 100%)`,
          border: `1px solid ${c.accent}30`,
          borderRadius: 24, padding: "60px 40px",
        }}>
          <div style={{ fontSize: 13, color: c.accent, fontWeight: 600, marginBottom: 16 }}>Prêt à sécuriser votre réseau ?</div>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 800,
            color: c.textPrimary, margin: "0 0 12px",
          }}>Démarrez votre essai gratuit</h2>
          <p style={{ fontSize: 16, color: c.textSecondary, marginBottom: 32 }}>14 jours gratuits, sans engagement, sans carte bancaire</p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "14px 40px", borderRadius: 12, fontSize: 16, fontWeight: 700,
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              color: "#fff", border: "none", cursor: "pointer",
              boxShadow: `0 8px 32px ${c.accent}30`,
            }}>
              Commencer gratuitement
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
