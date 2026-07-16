#!/bin/bash
set -e

# ============================================================
# Publish Script for The Vibe Coding Handbook
# ============================================================
# Usage:
#   ./scripts/publish.sh [patch|minor|major]
#
# Steps:
#   1. Run tests
#   2. Build all packages
#   3. Bump version
#   4. Publish @vibecoding/cli to npm
#   5. Create git tag
# ============================================================

VERSION_TYPE=${1:-patch}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[0;90m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  The Vibe Coding Handbook — Publish Script${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# Check if logged in to npm
echo -e "${DIM}Checking npm login...${NC}"
npm whoami > /dev/null 2>&1 || {
    echo -e "${RED}Error: Not logged in to npm.${NC}"
    echo "Run: npm login"
    exit 1
}

echo -e "${GREEN}✓${NC} Logged in as: $(npm whoami)"
echo ""

# Step 1: Build CLI
echo -e "${CYAN}── Building CLI ──${NC}"
cd "$(dirname "$0")/../cli"
pnpm install --frozen-lockfile
pnpm run build
echo -e "${GREEN}✓${NC} CLI built successfully"
echo ""

# Step 2: Run CLI tests (placeholder)
# echo -e "${CYAN}── Running Tests ──${NC}"
# npm test
# echo -e "${GREEN}✓${NC} Tests passed"
# echo ""

# Step 3: Bump version
echo -e "${CYAN}── Bumping Version (${VERSION_TYPE}) ──${NC}"
npm version "$VERSION_TYPE" --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✓${NC} Version bumped to ${NEW_VERSION}"
echo ""

# Step 4: Publish to npm
echo -e "${CYAN}── Publishing to npm ──${NC}"
echo -e "${DIM}Package: @vibecoding/cli@${NEW_VERSION}${NC}"
npm publish --access public
echo -e "${GREEN}✓${NC} Published to npm"
echo ""

# Step 5: Git tag
cd "$(dirname "$0")/.."
git add cli/package.json cli/pnpm-lock.yaml
git commit -m "chore(release): @vibecoding/cli@${NEW_VERSION}"
git tag "cli@${NEW_VERSION}"
echo -e "${GREEN}✓${NC} Git tag created: cli@${NEW_VERSION}"
echo ""

# Done
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Published @vibecoding/cli@${NEW_VERSION}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "Next steps:"
echo -e "  ${DIM}1.${NC} Verify: npm view @vibecoding/cli versions"
echo -e "  ${DIM}2.${NC} Install: npm install -g @vibecoding/cli"
echo -e "  ${DIM}3.${NC} Push:   git push && git push --tags"
