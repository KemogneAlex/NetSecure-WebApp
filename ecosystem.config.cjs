const fs = require("fs");
const path = require("path");

// Load .env from project root
const envFile = path.resolve(__dirname, ".env");
const env = {};
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf8")
    .split("\n")
    .forEach(line => {
      line = line.trim();
      if (line && !line.startsWith("#") && line.includes("=")) {
        const idx = line.indexOf("=");
        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim();
        env[key] = val;
      }
    });
}

module.exports = {
  apps: [
    {
      name: "web-app",
      cwd: "./packages/web",
      script: "src/server.ts",
      interpreter: "bun",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      restart_delay: 1000,
      env: {
        PORT: process.env.PORT || 4200,
        ...env,
      },
    },
  ],
};
