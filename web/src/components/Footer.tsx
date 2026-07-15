import { Link } from 'react-router';
import { Github, Heart, ExternalLink } from 'lucide-react';

const footerLinks = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Prompt Library', href: '/prompts' },
  { label: 'Tool Comparison', href: '/tools' },
  { label: 'Templates', href: '/templates' },
];

const communityLinks = [
  { label: 'Contributing Guide', href: 'https://github.com/you/the-vibecoding-handbook/blob/main/CONTRIBUTING.md', external: true },
  { label: 'Changelog', href: 'https://github.com/you/the-vibecoding-handbook/blob/main/CHANGELOG.md', external: true },
  { label: 'Issues', href: 'https://github.com/you/the-vibecoding-handbook/issues', external: true },
  { label: 'Discussions', href: 'https://github.com/you/the-vibecoding-handbook/discussions', external: true },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      {/* Massive CTA */}
      <div className="py-20 md:py-32 px-6 text-center">
        <h2
          className="font-display text-[#F0F2F5] uppercase leading-none"
          style={{ fontSize: 'clamp(40px, 10vw, 140px)' }}
        >
          START
          <br />
          BUILDING
        </h2>
        <p className="mt-6 text-[#8B92A8] text-lg max-w-xl mx-auto">
          Join thousands of developers coding with AI. Star the repo, contribute prompts, and help shape the future of vibe coding.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/you/the-vibecoding-handbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 transition-all duration-300"
          >
            <Github size={20} />
            Star on GitHub
          </a>
          <Link
            to="/docs"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#F0F2F5]/20 text-[#F0F2F5] font-heading rounded-full hover:border-cyan/60 hover:text-cyan transition-all duration-300"
          >
            Read the Guide
          </Link>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Handbook */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">Handbook</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#8B92A8] text-sm hover:text-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">Community</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B92A8] text-sm hover:text-cyan transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">Awesome Vibe Coding (soon)</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">Community Discord (soon)</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">Newsletter (soon)</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">MIT License</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">Code of Conduct</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8B92A8] text-xs flex items-center gap-1">
            Open source. Built with <Heart size={12} className="text-cyan" /> by the community.
          </p>
          <p className="text-[#8B92A8]/60 text-xs">
            &copy; {new Date().getFullYear()} The Vibe Coding Handbook. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
