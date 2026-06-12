import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { Shield, Mail, Lock, Eye, EyeOff, Sun, Moon, ArrowRight } from "lucide-react";

export default function Login() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("demo@netsecure.fr");
  const [password, setPassword] = useState("••••••••");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 800);
  };

  return (
    <div style={{
      minHeight: "100vh", background: c.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif", position: "relative",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${c.accent}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Theme toggle */}
      <button onClick={toggle} style={{
        position: "absolute", top: 20, right: 20,
        width: 40, height: 40, borderRadius: 10,
        border: `1px solid ${c.border}`, background: c.bgCard,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: c.textSecondary,
      }}>
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 8px 32px ${c.accent}30`,
            }}>
              <Shield size={26} color="#fff" />
            </div>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 24, fontWeight: 800, color: c.textPrimary }}>NetSecure</span>
          </Link>
          <p style={{ fontSize: 14, color: c.textMuted, marginTop: 12 }}>Connectez-vous à votre espace sécurisé</p>
        </div>

        {/* Card */}
        <div style={{
          background: c.bgCard, border: `1px solid ${c.border}`,
          borderRadius: 20, padding: 32,
          boxShadow: theme === "dark" ? `0 24px 60px rgba(0,0,0,0.4)` : `0 24px 60px rgba(0,0,0,0.08)`,
        }}>
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: c.textSecondary, marginBottom: 8 }}>
                Adresse email
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                border: `1.5px solid ${focused === "email" ? c.accent : c.border}`,
                borderRadius: 10, padding: "0 14px",
                background: c.bg, transition: "border-color 0.2s",
              }}>
                <Mail size={16} color={focused === "email" ? c.accent : c.textMuted} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="vous@exemple.fr"
                  style={{
                    flex: 1, padding: "12px 0", border: "none", background: "transparent",
                    fontSize: 14, color: c.textPrimary, outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.textSecondary }}>Mot de passe</label>
                <a href="#" style={{ fontSize: 12, color: c.accent, textDecoration: "none" }}>Mot de passe oublié ?</a>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                border: `1.5px solid ${focused === "pass" ? c.accent : c.border}`,
                borderRadius: 10, padding: "0 14px",
                background: c.bg, transition: "border-color 0.2s",
              }}>
                <Lock size={16} color={focused === "pass" ? c.accent : c.textMuted} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  style={{
                    flex: 1, padding: "12px 0", border: "none", background: "transparent",
                    fontSize: 14, color: c.textPrimary, outline: "none",
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  background: "none", border: "none", cursor: "pointer", color: c.textMuted, padding: 0,
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: loading
                ? c.bgElevated
                : `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              color: loading ? c.textMuted : "#fff",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
              boxShadow: loading ? "none" : `0 4px 20px ${c.accent}30`,
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: `2px solid ${c.textMuted}40`,
                    borderTopColor: c.textMuted,
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Connexion en cours...
                </>
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: c.textMuted }}>Pas encore de compte ? </span>
            <Link to="/register" style={{ fontSize: 13, color: c.accent, fontWeight: 600, textDecoration: "none" }}>
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 20, padding: "12px 16px", borderRadius: 10,
          background: c.accentDim, border: `1px solid ${c.accent}30`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Shield size={14} color={c.accent} />
          <span style={{ fontSize: 12, color: c.textSecondary }}>
            <b style={{ color: c.accent }}>Démo :</b> Utilisez n'importe quels identifiants pour accéder au dashboard
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
