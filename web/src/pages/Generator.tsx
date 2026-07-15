import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  ArrowLeft, Download, Check, Copy, FileCode, Shield,
  ClipboardCheck, GitBranch, Server, FileText,
  ChevronRight, Sparkles, FolderOpen, Info,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  generateAgentsMd,
  generateCursorRules,
  generateGitPolicy,
  generateSecurityPolicy,
  generateTestingPolicy,
  generateDeploymentPolicy,
  generateAdr,
} from '../data/wizard';
import type { WizardAnswers } from '../data/wizard';

interface FileTab {
  id: string;
  label: string;
  filename: string;
  icon: React.ReactNode;
  generator: (answers: WizardAnswers) => string;
}

export default function Generator() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers as WizardAnswers | undefined;

  const [activeTab, setActiveTab] = useState('agents');
  const [copied, setCopied] = useState(false);

  // Redirect if no answers
  useEffect(() => {
    if (!answers) {
      navigate('/wizard');
    }
  }, [answers, navigate]);

  const tabs: FileTab[] = useMemo(() => [
    {
      id: 'agents',
      label: 'AGENTS.md',
      filename: 'AGENTS.md',
      icon: <FileCode size={16} />,
      generator: generateAgentsMd,
    },
    {
      id: 'cursorrules',
      label: '.cursorrules',
      filename: '.cursorrules',
      icon: <FileCode size={16} />,
      generator: generateCursorRules,
    },
    {
      id: 'git',
      label: 'Git Policy',
      filename: '.vibecoding/policies/git-policy.md',
      icon: <GitBranch size={16} />,
      generator: generateGitPolicy,
    },
    {
      id: 'security',
      label: 'Security',
      filename: '.vibecoding/policies/security-policy.md',
      icon: <Shield size={16} />,
      generator: generateSecurityPolicy,
    },
    {
      id: 'testing',
      label: 'Testing',
      filename: '.vibecoding/policies/testing-policy.md',
      icon: <ClipboardCheck size={16} />,
      generator: generateTestingPolicy,
    },
    {
      id: 'deployment',
      label: 'Deployment',
      filename: '.vibecoding/policies/deployment-policy.md',
      icon: <Server size={16} />,
      generator: generateDeploymentPolicy,
    },
    {
      id: 'adr',
      label: 'ADR-001',
      filename: '.vibecoding/decisions/ADR-001-architecture.md',
      icon: <FileText size={16} />,
      generator: (a) => generateAdr(a, 1),
    },
  ], []);

  if (!answers) {
    return null;
  }

  const activeFile = tabs.find((t) => t.id === activeTab) || tabs[0];
  const content = activeFile.generator(answers);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    // Add all generated files
    zip.file('AGENTS.md', generateAgentsMd(answers));
    zip.file('.cursorrules', generateCursorRules(answers));
    zip.file('.vibecoding/policies/git-policy.md', generateGitPolicy());
    zip.file('.vibecoding/policies/security-policy.md', generateSecurityPolicy());
    zip.file('.vibecoding/policies/testing-policy.md', generateTestingPolicy(answers));
    zip.file('.vibecoding/policies/deployment-policy.md', generateDeploymentPolicy(answers));
    zip.file('.vibecoding/decisions/ADR-001-architecture.md', generateAdr(answers, 1));
    zip.file('.vibecoding/README.md', generateReadme(answers));

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${answers.projectName || 'project'}-vibecoding.zip`);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    saveAs(blob, activeFile.filename.split('/').pop() || activeFile.filename);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#0B0C10' }}>
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-1 text-[#8B92A8] hover:text-cyan text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to wizard
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                    <Sparkles size={14} className="text-cyan" />
                    <span className="text-cyan text-xs font-heading">Generated</span>
                  </div>
                </div>
                <h1
                  className="font-display text-[#F0F2F5] uppercase"
                  style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}
                >
                  Your Project Setup
                </h1>
                <p className="mt-2 text-[#8B92A8]">
                  <span className="text-cyan font-heading">{answers.projectName}</span> — 
                  Complete governance package generated.
                </p>
                <p className="mt-3 text-xs text-[#8B92A8]/80 flex items-center gap-1.5">
                  <Info size={12} className="text-cyan shrink-0" />
                  Generated from your wizard answers, not an analysis of your repo — review and adapt before committing.
                </p>
              </div>

              <button
                onClick={handleDownloadAll}
                className="group flex items-center gap-2 px-6 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 hover:glow-cyan transition-all"
              >
                <Download size={18} />
                Download All as ZIP
              </button>
            </div>
          </div>

          {/* File Structure Preview */}
          <div className="mb-8 p-5 rounded-xl bg-surface/30 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen size={16} className="text-cyan" />
              <span className="font-heading text-sm font-semibold text-[#F0F2F5]">
                Generated Structure
              </span>
            </div>
            <div className="font-mono text-xs space-y-1 text-[#8B92A8]">
              <div className="text-cyan">{answers.projectName || 'project'}/</div>
              <div className="pl-4 text-[#F0F2F5]">AGENTS.md</div>
              <div className="pl-4 text-[#F0F2F5]">.cursorrules</div>
              <div className="pl-4 text-cyan/60">.vibecoding/</div>
              <div className="pl-8 text-cyan/40">README.md</div>
              <div className="pl-8 text-cyan/40">policies/</div>
              <div className="pl-12 text-[#8B92A8]">git-policy.md</div>
              <div className="pl-12 text-[#8B92A8]">security-policy.md</div>
              <div className="pl-12 text-[#8B92A8]">testing-policy.md</div>
              <div className="pl-12 text-[#8B92A8]">deployment-policy.md</div>
              <div className="pl-8 text-cyan/40">decisions/</div>
              <div className="pl-12 text-[#8B92A8]">ADR-001-architecture.md</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: File Tabs */}
            <div className="lg:col-span-1">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan/10 text-cyan border border-cyan/20'
                        : 'text-[#8B92A8] hover:text-[#F0F2F5] hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-heading text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight size={14} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Setup Summary */}
              <div className="mt-6 p-4 rounded-xl bg-surface/30 border border-white/5">
                <h3 className="font-heading text-xs font-semibold text-[#F0F2F5] mb-3 uppercase tracking-wider">
                  Your Stack
                </h3>
                <div className="space-y-2 text-xs">
                  <StackItem label="Frontend" value={answers.frontend} />
                  <StackItem label="Backend" value={answers.backend} />
                  <StackItem label="Database" value={answers.database} />
                  <StackItem label="Auth" value={answers.auth} />
                  <StackItem label="Hosting" value={answers.hosting} />
                  {answers.payments !== 'none' && (
                    <StackItem label="Payments" value={answers.payments} />
                  )}
                  {answers.email !== 'none' && (
                    <StackItem label="Email" value={answers.email} />
                  )}
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-white/5 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <FileCode size={14} className="text-cyan" />
                    <span className="font-mono text-xs text-[#F0F2F5]">
                      {activeFile.filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[#8B92A8] text-xs hover:bg-white/10 hover:text-[#F0F2F5] transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadSingle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs hover:bg-cyan/20 transition-colors"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-[#0B0C10] overflow-x-auto max-h-[70vh] overflow-y-auto">
                  <pre className="font-mono text-sm text-[#C792EA] whitespace-pre-wrap leading-relaxed">
                    {content}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-cyan/5 to-purple-code/5 border border-cyan/10">
            <h2 className="font-heading text-xl font-semibold text-[#F0F2F5] mb-4">
              What&apos;s Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">
                    Download & Extract
                  </h4>
                  <p className="text-xs text-[#8B92A8]">
                    Download the ZIP and extract it at your project root.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">
                    Customize
                  </h4>
                  <p className="text-xs text-[#8B92A8]">
                    Edit AGENTS.md with your project-specific details and patterns.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-heading text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-1">
                    Start Coding
                  </h4>
                  <p className="text-xs text-[#8B92A8]">
                    Your AI agent now has full context. Start prompting with confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
              <Link
                to="/docs"
                className="flex items-center gap-2 text-cyan text-sm font-heading hover:underline"
              >
                Read the full guide
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/prompts"
                className="flex items-center gap-2 text-cyan text-sm font-heading hover:underline"
              >
                Browse prompt library
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/templates"
                className="flex items-center gap-2 text-cyan text-sm font-heading hover:underline"
              >
                Download more templates
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StackItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#8B92A8]">{label}</span>
      <span className="text-[#F0F2F5] font-heading">{value}</span>
    </div>
  );
}

function generateReadme(answers: WizardAnswers): string {
  return `# ${answers.projectName || 'Project'} — Vibe Coding Setup

> This project uses the Vibe Coding governance framework.
> Generated by [vibecoding.guide](https://vibecoding.guide)

## Quick Start

1. Read \`AGENTS.md\` — this is the main context file for AI agents
2. Check \`.cursorrules\` — IDE-specific rules
3. Review \`.vibecoding/policies/\` — project policies
4. Start coding with your AI agent

## Policies

| Policy | File | Purpose |
|--------|------|---------|
| Git | \`.vibecoding/policies/git-policy.md\` | Branching strategy, commit conventions |
| Security | \`.vibecoding/policies/security-policy.md\` | Security rules and checklist |
| Testing | \`.vibecoding/policies/testing-policy.md\` | Testing requirements |
| Deployment | \`.vibecoding/policies/deployment-policy.md\` | Deploy flow and checklist |

## Architecture Decisions

See \`.vibecoding/decisions/\` for Architecture Decision Records (ADRs).

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | ${answers.frontend} |
| Backend | ${answers.backend} |
| Database | ${answers.database} |
| Auth | ${answers.auth} |
| Hosting | ${answers.hosting} |

---

*Setup generated on ${new Date().toISOString().split('T')[0]}*
`;
}
