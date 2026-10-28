/* Fast source and strict TypeScript check for the Next.js app. */
const { existsSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const required = [
  "app/layout.tsx",
  "app/page.tsx",
  "features/directory/directory-app.tsx",
  "lib/types.ts",
  "lib/directory-api.ts",
  "api/umkm.js",
];
const missing = required.filter((file) => !existsSync(path.join(root, file)));

if (missing.length) {
  console.error(`Missing required app files: ${missing.join(", ")}`);
  process.exit(1);
}

execFileSync(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "--noEmit"], {
  cwd: root,
  stdio: "inherit",
});
console.log("Pasar UMKM source checks passed.");
