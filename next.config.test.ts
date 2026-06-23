import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("T001: Next.js (App Router) + TypeScript strict project setup", () => {
  const readJson = (filePath: string): unknown => {
    const content = fs.readFileSync(path.join(process.cwd(), filePath), "utf-8");
    return JSON.parse(content);
  };

  it("has package.json with Next.js and React dependencies", () => {
    const pkg = readJson("package.json") as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies["react-dom"]).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
  });

  it("has tsconfig.json with strict: true and noImplicitAny: true", () => {
    const tsconfig = readJson("tsconfig.json") as {
      compilerOptions: Record<string, unknown>;
    };
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
  });

  it("has next.config.ts file that exports a config object", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "next.config.ts"),
      "utf-8"
    );
    expect(content).toContain("import type { NextConfig }");
    expect(content).toContain("export default nextConfig");
  });

  it("has app/globals.css with baseline styles", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "app", "globals.css"),
      "utf-8"
    );
    expect(content).toContain("box-sizing: border-box");
    expect(content).toContain("padding: 0");
    expect(content).toContain("margin: 0");
  });
});
