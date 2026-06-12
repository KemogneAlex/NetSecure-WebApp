import { db } from "./database";
import * as schema from "./database/schema";

export async function seed() {
  // Check if already seeded
  const existing = await db.select().from(schema.users).limit(1);
  if (existing.length > 0) return;

  // Create demo user
  const [user] = await db.insert(schema.users).values({
    name: "Alex Tchamo",
    email: "demo@netsecure.io",
    password: "hashed_demo_password",
    plan: "pro",
  }).returning();

  // Devices
  const deviceData = [
    { name: "Router Principal", ip: "192.168.1.1", mac: "A4:C3:F0:12:34:56", type: "router", os: "OpenWRT", vendor: "TP-Link", status: "online", riskLevel: "low", openPorts: JSON.stringify([80, 443, 22]) },
    { name: "MacBook Pro Alex", ip: "192.168.1.10", mac: "00:1A:2B:3C:4D:5E", type: "pc", os: "macOS 14", vendor: "Apple", status: "online", riskLevel: "low", openPorts: JSON.stringify([]) },
    { name: "iPhone 15 Pro", ip: "192.168.1.11", mac: "F8:4D:89:AB:CD:EF", type: "phone", os: "iOS 17", vendor: "Apple", status: "online", riskLevel: "low", openPorts: JSON.stringify([]) },
    { name: "PC Bureau", ip: "192.168.1.12", mac: "B8:27:EB:12:34:56", type: "pc", os: "Windows 11", vendor: "Dell", status: "online", riskLevel: "medium", openPorts: JSON.stringify([135, 445, 3389]) },
    { name: "Imprimante HP", ip: "192.168.1.20", mac: "3C:D9:2B:FF:11:22", type: "printer", os: "HP Firmware", vendor: "HP", status: "online", riskLevel: "medium", openPorts: JSON.stringify([80, 9100, 631]) },
    { name: "Caméra IP Bureau", ip: "192.168.1.30", mac: "D4:6A:6A:AA:BB:CC", type: "camera", os: "Firmware 2.1", vendor: "Hikvision", status: "online", riskLevel: "high", openPorts: JSON.stringify([80, 554, 8000, 8080]) },
    { name: "Appareil Inconnu", ip: "192.168.1.99", mac: "00:00:00:00:00:01", type: "unknown", os: null, vendor: "Inconnu", status: "suspicious", riskLevel: "critical", openPorts: JSON.stringify([22, 23, 80, 443, 8443]) },
    { name: "Laptop Stagiaire", ip: "192.168.1.15", mac: "44:8A:5B:CD:EF:01", type: "pc", os: "Ubuntu 22.04", vendor: "Lenovo", status: "offline", riskLevel: "low", openPorts: JSON.stringify([22]) },
  ];

  const insertedDevices = await db.insert(schema.devices).values(
    deviceData.map(d => ({ ...d, userId: user.id }))
  ).returning();

  // Alerts
  const now = new Date();
  const alertData = [
    {
      deviceId: insertedDevices[6].id,
      type: "intrusion",
      severity: "critical",
      title: "Tentative d'intrusion détectée",
      description: "Un appareil non reconnu (192.168.1.99) tente d'accéder à des services sensibles. Comportement anormal détecté sur 5 ports simultanément.",
      sourceIp: "192.168.1.99",
      destIp: "192.168.1.1",
      status: "open",
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
    },
    {
      deviceId: insertedDevices[5].id,
      type: "portscan",
      severity: "high",
      title: "Scan de ports détecté",
      description: "La caméra IP (192.168.1.30) présente un firmware obsolète avec des vulnérabilités connues (CVE-2023-28812). Mise à jour urgente recommandée.",
      sourceIp: "203.0.113.45",
      destIp: "192.168.1.30",
      status: "investigating",
      createdAt: new Date(now.getTime() - 45 * 60 * 1000),
    },
    {
      deviceId: insertedDevices[3].id,
      type: "anomaly",
      severity: "high",
      title: "Port RDP exposé (3389)",
      description: "Le PC Bureau (192.168.1.12) expose le port RDP sans restriction. Risque élevé d'attaque brute-force. Désactivez l'accès distant ou restreignez les IPs autorisées.",
      sourceIp: "192.168.1.12",
      destIp: null,
      status: "open",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      deviceId: insertedDevices[4].id,
      type: "unauthorized",
      severity: "medium",
      title: "Accès non autorisé à l'imprimante",
      description: "Tentative d'accès au panneau d'administration de l'imprimante HP depuis une IP externe. Accès bloqué par le pare-feu.",
      sourceIp: "198.51.100.23",
      destIp: "192.168.1.20",
      status: "resolved",
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      resolvedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
    {
      deviceId: null,
      type: "ddos",
      severity: "medium",
      title: "Trafic inhabituel détecté",
      description: "Pic de trafic entrant anormal détecté (+340% vs moyenne). Possible tentative DDoS en cours. Surveillance renforcée activée.",
      sourceIp: "Multiple",
      destIp: "192.168.1.1",
      status: "resolved",
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      resolvedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      deviceId: null,
      type: "anomaly",
      severity: "low",
      title: "Connexion DNS inhabituelle",
      description: "Requêtes DNS vers des domaines suspects détectées depuis le réseau local. Analyse en cours.",
      sourceIp: "192.168.1.10",
      destIp: "8.8.8.8",
      status: "investigating",
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    },
    {
      deviceId: null,
      type: "intrusion",
      severity: "info",
      title: "Scan de vulnérabilités planifié terminé",
      description: "Le scan hebdomadaire de vulnérabilités s'est terminé avec succès. 3 vulnérabilités détectées, 1 critique, 1 haute, 1 moyenne.",
      sourceIp: null,
      destIp: null,
      status: "resolved",
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      resolvedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
    },
  ];

  await db.insert(schema.alerts).values(
    alertData.map(a => ({ ...a, userId: user.id }))
  );

  // Reports
  await db.insert(schema.reports).values([
    {
      userId: user.id,
      title: "Rapport Hebdomadaire — Semaine 23",
      type: "weekly",
      securityScore: 72,
      totalAlerts: 14,
      resolvedAlerts: 11,
      devicesScanned: 8,
      vulnerabilities: 3,
      summary: "Semaine marquée par une tentative d'intrusion détectée et neutralisée. Score en baisse de 5 points dû à la caméra IP vulnérable.",
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      title: "Rapport Hebdomadaire — Semaine 22",
      type: "weekly",
      securityScore: 77,
      totalAlerts: 9,
      resolvedAlerts: 9,
      devicesScanned: 8,
      vulnerabilities: 1,
      summary: "Semaine calme. Une seule vulnérabilité détectée (faible risque) et corrigée. Score stable.",
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      title: "Rapport Mensuel — Mai 2025",
      type: "monthly",
      securityScore: 81,
      totalAlerts: 38,
      resolvedAlerts: 35,
      devicesScanned: 8,
      vulnerabilities: 5,
      summary: "Mois globalement sécurisé. 38 alertes dont 35 résolues. Amélioration notable de la gestion des incidents (-20% temps de résolution).",
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
  ]);

  // Network stats (last 24h)
  const statsData = [];
  for (let i = 23; i >= 0; i--) {
    statsData.push({
      userId: user.id,
      timestamp: new Date(now.getTime() - i * 60 * 60 * 1000),
      inboundMbps: Math.round((Math.random() * 40 + 10) * 10) / 10,
      outboundMbps: Math.round((Math.random() * 20 + 5) * 10) / 10,
      activeConnections: Math.floor(Math.random() * 50 + 20),
      blockedRequests: Math.floor(Math.random() * 30),
    });
  }
  await db.insert(schema.networkStats).values(statsData);

  console.log("✅ Database seeded with demo data");
}
