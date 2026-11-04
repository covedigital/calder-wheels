#!/usr/bin/node
// Promote current screenshots/ to screenshots-baseline/ — MANUAL APPROVAL step.
// Only run after a human has reviewed the new screenshots and accepted them.
import fs from "node:fs";
import { execSync } from "node:child_process";
fs.rmSync("screenshots-baseline", { recursive: true, force: true });
execSync("cp -R screenshots screenshots-baseline");
console.log("Baselines promoted. Commit screenshots-baseline/ to the repo.");
