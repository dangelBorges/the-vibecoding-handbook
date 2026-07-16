#!/usr/bin/env node
/**
 * Postinstall welcome banner.
 *
 * Shows the brand banner right after the CLI is installed — the product's
 * "cover". It stays silent in CI, on non-TTY installs, inside the
 * development repo itself, and when the user opts out.
 *
 * A banner must NEVER break an installation: any error exits 0 silently.
 */
(async () => {
  try {
    const env = process.env;
    if (env.VIBE_FORCE_BANNER !== '1') {
      if (!process.stdout.isTTY) return; // piped output / build logs
      if (env.CI) return; // CI noise
      if (env.VIBE_NO_BANNER) return; // explicit opt-out
      if (env.TERM === 'dumb') return; // incapable terminal
      // The published tarball only ships dist/, bin/ and README.md — a
      // tsconfig.json next to us means `pnpm install` in the dev repo.
      const { existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      if (existsSync(join(__dirname, '..', 'tsconfig.json'))) return;
    }
    const { renderWelcome } = await import('../dist/utils/banner.js');
    renderWelcome();
  } catch {
    // Never fail an install because of a banner.
  }
})();
