/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const userAgent = process.env.npm_config_user_agent || "";

if (!userAgent.includes("pnpm")) {
  console.error(`
❌ this project manages dependencies using pnpm, kindly use pnpm to proceed or install dependencies
`);

  // Clean up other lock files if they were accidentally created
  const otherLockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
  otherLockFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore errors
      }
    }
  });

  process.exit(1);
}

const match = userAgent.match(/pnpm\/(\d+\.\d+\.\d+)/);

if (!match) {
  console.error("❌ Unable to detect pnpm version.");
  process.exit(1);
}

const current = match[1];
const required = "1.1.0";

const isValid = (a, b) => {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (aParts[i] > bParts[i]) return true;
    if (aParts[i] < bParts[i]) return false;
  }
  return true;
};

if (!isValid(current, required)) {
  console.error(`
❌ pnpm version too old.

Required: >= ${required}
Detected: ${current}

Please upgrade pnpm:
👉 pnpm install -g pnpm
`);
  process.exit(1);
}
