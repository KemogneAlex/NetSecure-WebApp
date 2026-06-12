import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./database";
import * as schema from "./database/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { seed } from "./seed";

// Seed on startup
seed().catch(console.error);

const DEMO_USER_ID = 1;

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: "*" }))

  // Health
  .get("/health", (c) => c.json({ status: "ok" }, 200))

  // Dashboard stats
  .get("/dashboard", async (c) => {
    const [devices, alertRows, recentAlerts, stats] = await Promise.all([
      db.select().from(schema.devices).where(eq(schema.devices.userId, DEMO_USER_ID)),
      db.select().from(schema.alerts).where(eq(schema.alerts.userId, DEMO_USER_ID)),
      db.select().from(schema.alerts)
        .where(eq(schema.alerts.userId, DEMO_USER_ID))
        .orderBy(desc(schema.alerts.createdAt))
        .limit(5),
      db.select().from(schema.networkStats)
        .where(eq(schema.networkStats.userId, DEMO_USER_ID))
        .orderBy(desc(schema.networkStats.timestamp))
        .limit(24),
    ]);

    const onlineDevices = devices.filter(d => d.status === "online").length;
    const suspiciousDevices = devices.filter(d => d.status === "suspicious").length;
    const openAlerts = alertRows.filter(a => a.status === "open").length;
    const criticalAlerts = alertRows.filter(a => a.severity === "critical" && a.status === "open").length;

    // Security score calculation
    let score = 100;
    score -= criticalAlerts * 15;
    score -= openAlerts * 5;
    score -= suspiciousDevices * 20;
    const highRisk = devices.filter(d => d.riskLevel === "high" || d.riskLevel === "critical").length;
    score -= highRisk * 8;
    score = Math.max(0, Math.min(100, score));

    return c.json({
      score,
      devices: { total: devices.length, online: onlineDevices, suspicious: suspiciousDevices },
      alerts: { total: alertRows.length, open: openAlerts, critical: criticalAlerts },
      recentAlerts,
      networkStats: stats.reverse(),
    }, 200);
  })

  // Devices
  .get("/devices", async (c) => {
    const devices = await db.select().from(schema.devices)
      .where(eq(schema.devices.userId, DEMO_USER_ID))
      .orderBy(desc(schema.devices.lastSeen));
    return c.json({ devices }, 200);
  })

  .patch("/devices/:id/status", async (c) => {
    const id = parseInt(c.req.param("id"));
    const { status } = await c.req.json();
    await db.update(schema.devices).set({ status }).where(eq(schema.devices.id, id));
    return c.json({ success: true }, 200);
  })

  // Alerts
  .get("/alerts", async (c) => {
    const severity = c.req.query("severity");
    const status = c.req.query("status");
    let query = db.select().from(schema.alerts).where(eq(schema.alerts.userId, DEMO_USER_ID));
    const alerts = await db.select().from(schema.alerts)
      .where(eq(schema.alerts.userId, DEMO_USER_ID))
      .orderBy(desc(schema.alerts.createdAt));

    const filtered = alerts.filter(a => {
      if (severity && severity !== "all" && a.severity !== severity) return false;
      if (status && status !== "all" && a.status !== status) return false;
      return true;
    });

    return c.json({ alerts: filtered }, 200);
  })

  .patch("/alerts/:id/status", async (c) => {
    const id = parseInt(c.req.param("id"));
    const { status } = await c.req.json();
    const update: any = { status };
    if (status === "resolved") update.resolvedAt = new Date();
    await db.update(schema.alerts).set(update).where(eq(schema.alerts.id, id));
    return c.json({ success: true }, 200);
  })

  // Reports
  .get("/reports", async (c) => {
    const reports = await db.select().from(schema.reports)
      .where(eq(schema.reports.userId, DEMO_USER_ID))
      .orderBy(desc(schema.reports.createdAt));
    return c.json({ reports }, 200);
  })

  // Network stats
  .get("/network-stats", async (c) => {
    const stats = await db.select().from(schema.networkStats)
      .where(eq(schema.networkStats.userId, DEMO_USER_ID))
      .orderBy(desc(schema.networkStats.timestamp))
      .limit(24);
    return c.json({ stats: stats.reverse() }, 200);
  });

export type AppType = typeof app;
export default app;
