import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan").notNull().default("free"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const devices = sqliteTable("devices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  ip: text("ip").notNull(),
  mac: text("mac").notNull(),
  type: text("type").notNull(), // router, pc, phone, printer, camera, unknown
  os: text("os"),
  vendor: text("vendor"),
  status: text("status").notNull().default("online"), // online, offline, suspicious
  riskLevel: text("risk_level").notNull().default("low"), // low, medium, high, critical
  firstSeen: integer("first_seen", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastSeen: integer("last_seen", { mode: "timestamp" }).$defaultFn(() => new Date()),
  openPorts: text("open_ports"), // JSON string
});

export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  deviceId: integer("device_id"),
  type: text("type").notNull(), // intrusion, portscan, malware, unauthorized, ddos, anomaly
  severity: text("severity").notNull(), // info, low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceIp: text("source_ip"),
  destIp: text("dest_ip"),
  status: text("status").notNull().default("open"), // open, investigating, resolved
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
});

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // weekly, monthly, incident
  securityScore: integer("security_score").notNull(),
  totalAlerts: integer("total_alerts").notNull(),
  resolvedAlerts: integer("resolved_alerts").notNull(),
  devicesScanned: integer("devices_scanned").notNull(),
  vulnerabilities: integer("vulnerabilities").notNull(),
  summary: text("summary").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const networkStats = sqliteTable("network_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
  inboundMbps: real("inbound_mbps").notNull(),
  outboundMbps: real("outbound_mbps").notNull(),
  activeConnections: integer("active_connections").notNull(),
  blockedRequests: integer("blocked_requests").notNull(),
});
