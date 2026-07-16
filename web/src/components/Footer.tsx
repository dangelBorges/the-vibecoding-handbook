import { Link } from 'react-router';
import { Github, Heart, ExternalLink } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import footer from '../i18n/translations/footer';

export default function Footer() {
  const { t } = useNamespace(footer);

  const footerLinks = [
    { label: t('documentation'), href: '/docs' },
    { label: t('promptLibrary'), href: '/prompts' },
    { label: t('toolComparison'), href: '/tools' },
    { label: t('templates'), href: '/templates' },
  ];

  const communityLinks = [
    { label: t('contributingGuide'), href: 'https://github.com/dangelBorges/the-vibecoding-handbook/blob/main/.github/CONTRIBUTING.md', external: true },
    { label: t('changelog'), href: 'https://github.com/dangelBorges/the-vibecoding-handbook/blob/main/CHANGELOG.md', external: true },
    { label: t('issues'), href: 'https://github.com/dangelBorges/the-vibecoding-handbook/issues', external: true },
    { label: t('discussions'), href: 'https://github.com/dangelBorges/the-vibecoding-handbook/discussions', external: true },
  ];

  return (
    <footer className="bg-surface border-t border-white/5">
      {/* Massive CTA */}
      <div className="py-20 md:py-32 px-6 text-center">
        <h2
          className="font-display text-[#F0F2F5] uppercase leading-none"
          style={{ fontSize: 'clamp(40px, 10vw, 140px)' }}
        >
          {t('ctaTitle')}
        </h2>
        <p className="mt-6 text-[#8B92A8] text-lg max-w-xl mx-auto">
          {t('ctaSubtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/dangelBorges/the-vibecoding-handbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-cyan text-[#0B0C10] font-heading font-semibold rounded-full hover:bg-cyan/90 transition-all duration-300"
          >
            <Github size={20} />
            {t('starOnGitHub')}
          </a>
          <Link
            to="/docs"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#F0F2F5]/20 text-[#F0F2F5] font-heading rounded-full hover:border-cyan/60 hover:text-cyan transition-all duration-300"
          >
            {t('readTheGuide')}
          </Link>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Handbook */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">{t('handbook')}</h4>
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
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">{t('community')}</h4>
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
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">{t('resources')}</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">{t('awesomeVibeCoding')}</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">{t('communityDiscord')}</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">{t('newsletter')}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-[#F0F2F5] text-sm font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">{t('mitLicense')}</span>
              </li>
              <li>
                <span className="text-[#8B92A8] text-sm cursor-default">{t('codeOfConduct')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8B92A8] text-xs flex items-center gap-1">
            {t('builtWith').replace('♥', '')}
            <Heart size={12} className="text-cyan" />
            {t('byTheCommunity')}
          </p>
          <p className="text-[#8B92A8]/60 text-xs">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
