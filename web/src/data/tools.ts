export interface Tool {
  id: string;
  name: string;
  tagline: string;
  category: 'ide' | 'cli' | 'app-builder';
  website: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  pricing: string;
  rating: number;
  features: {
    contextAwareness: number;
    multiFile: number;
    terminal: number;
    uiGeneration: number;
    speed: number;
  };
}

export const tools: Tool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    tagline: 'The AI-native code editor',
    category: 'ide',
    website: 'https://cursor.com',
    pros: [
      'Native AI integration (no plugins)',
      'Excellent codebase context awareness',
      'Composer for multi-file edits',
      'Fast and responsive UI',
      'Large community and ecosystem',
    ],
    cons: [
      'VS Code fork (slight delay on updates)',
      'Can be aggressive with auto-suggestions',
      'Requires paid plan for heavy usage',
      'Some features locked behind paywall',
    ],
    bestFor: 'Full-stack developers working on production codebases',
    pricing: 'Free tier, Pro $20/mo, Business $40/user/mo',
    rating: 4.7,
    features: {
      contextAwareness: 5,
      multiFile: 5,
      terminal: 3,
      uiGeneration: 3,
      speed: 4,
    },
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    tagline: 'Terminal-based AI agent from Anthropic',
    category: 'cli',
    website: 'https://claude.ai/code',
    pros: [
      'Exceptional reasoning and planning',
      'Works with any editor or IDE',
      'Can execute commands and tests',
      'Deep context understanding',
      'Excellent for complex architecture',
    ],
    cons: [
      'Terminal-only (no GUI)',
      'Slower than IDE-integrated tools',
      'Higher cost for long sessions',
      'Steep learning curve',
    ],
    bestFor: 'Architecture decisions, complex refactors, CLI workflows',
    pricing: 'Included with Claude Pro ($20/mo)',
    rating: 4.5,
    features: {
      contextAwareness: 5,
      multiFile: 4,
      terminal: 5,
      uiGeneration: 1,
      speed: 3,
    },
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    tagline: 'Agentic IDE with cascade workflows',
    category: 'ide',
    website: 'https://windsurf.com',
    pros: [
      'Cascade agent plans and executes',
      'Generous free tier',
      'Good context understanding',
      'Competitive pricing',
      'Rapid feature development',
    ],
    cons: [
      'Smaller community than Cursor',
      'Some stability issues',
      'Less mature plugin ecosystem',
      'Documentation gaps',
    ],
    bestFor: 'Developers wanting a capable free alternative to Cursor',
    pricing: 'Free tier, Pro $12/mo',
    rating: 4.2,
    features: {
      contextAwareness: 4,
      multiFile: 4,
      terminal: 3,
      uiGeneration: 3,
      speed: 4,
    },
  },
  {
    id: 'v0',
    name: 'v0',
    tagline: 'Generate UI with natural language',
    category: 'app-builder',
    website: 'https://v0.dev',
    pros: [
      'Incredible UI generation from prompts',
      'Exports to Next.js + Tailwind',
      'Visual editing capabilities',
      'shadcn/ui integration',
      'Rapid prototyping',
    ],
    cons: [
      'Limited to UI components',
      'Not a full IDE',
      'Requires manual integration',
      'Less control over logic',
    ],
    bestFor: 'Rapid UI prototyping, component generation',
    pricing: 'Free tier, Pro $20/mo',
    rating: 4.4,
    features: {
      contextAwareness: 2,
      multiFile: 2,
      terminal: 1,
      uiGeneration: 5,
      speed: 5,
    },
  },
  {
    id: 'lovable',
    name: 'Lovable',
    tagline: 'Full-stack apps with minimal code',
    category: 'app-builder',
    website: 'https://lovable.dev',
    pros: [
      'True full-stack generation',
      'Supabase integration',
      'GitHub sync',
      'One-click deploy',
      'Great for MVPs',
    ],
    cons: [
      'Less control over architecture',
      'Vendor lock-in concerns',
      'Limited customization',
      'Not suitable for complex apps',
    ],
    bestFor: 'Rapid MVP development, prototypes, simple apps',
    pricing: 'Free tier, Pro $20/mo',
    rating: 4.0,
    features: {
      contextAwareness: 2,
      multiFile: 3,
      terminal: 1,
      uiGeneration: 5,
      speed: 5,
    },
  },
  {
    id: 'zed',
    name: 'Zed',
    tagline: 'The fast, collaborative code editor',
    category: 'ide',
    website: 'https://zed.dev',
    pros: [
      'Extremely fast (Rust-native)',
      'Real-time collaboration',
      'Open source',
      'Growing AI features',
      'Minimal resource usage',
    ],
    cons: [
      'Smaller ecosystem than VS Code',
      'AI features less mature',
      'Limited extension library',
      'Mac-only (for now)',
    ],
    bestFor: 'Speed-focused developers, pair programming',
    pricing: 'Free (open source)',
    rating: 3.8,
    features: {
      contextAwareness: 3,
      multiFile: 3,
      terminal: 3,
      uiGeneration: 2,
      speed: 5,
    },
  },
];

export const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'ide', label: 'IDEs' },
  { value: 'cli', label: 'CLI Agents' },
  { value: 'app-builder', label: 'App Builders' },
] as const;

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
