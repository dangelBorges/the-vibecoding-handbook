import fs from 'fs';
import path from 'path';

export function readVibeFile(relativePath: string): string | null {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try { return fs.readFileSync(fullPath, 'utf-8'); } catch { return null; }
}
