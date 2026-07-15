import fs from 'fs';
import path from 'path';

export function readVibeFile(relativePath: string): string | null {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try { return fs.readFileSync(fullPath, 'utf-8'); } catch { return null; }
}

export function writeVibeFile(relativePath: string, content: string): boolean {
  const fullPath = path.join(process.cwd(), relativePath);
  const dir = path.dirname(fullPath);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
    return true;
  } catch { return false; }
}
