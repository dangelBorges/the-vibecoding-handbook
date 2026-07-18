import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Github } from 'lucide-react';
import { useNamespace } from '../i18n/useNamespace';
import navigation from '../i18n/translations/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Navigation() {
  const { t } = useNamespace(navigation);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close the mobile menu on route change (adjust state during render
  // instead of in an effect — see react.dev "adjusting state when a prop changes")
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('docs'), href: '/docs' },
    { label: t('wizard'), href: '/wizard' },
    { label: t('optimize'), href: '/optimize' },
    { label: t('community'), href: '/community-prompts' },
    { label: t('tools'), href: '/tools' },
    { label: t('templates'), href: '/templates' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-surface border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading text-sm tracking-[0.2em] text-[#F0F2F5] hover:text-cyan transition-colors">
          <img src="/favicon180x180.png" alt="" className="h-10 w-10 rounded" />
          {t('logo')}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-heading transition-colors ${
                isActive(link.href)
                  ? 'text-cyan'
                  : 'text-[#8B92A8] hover:text-[#F0F2F5]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Language */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="https://github.com/dangelBorges/the-vibecoding-handbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 border border-cyan/60 text-cyan text-sm font-heading rounded-full hover:bg-cyan/10 hover:glow-cyan transition-all duration-300"
          >
            <Github size={16} />
            {t('contribute')}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F0F2F5]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-surface border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-heading transition-colors ${
                  isActive(link.href)
                    ? 'text-cyan'
                    : 'text-[#8B92A8] hover:text-[#F0F2F5]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <a
              href="https://github.com/dangelBorges/the-vibecoding-handbook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-cyan/60 text-cyan text-sm font-heading rounded-full hover:bg-cyan/10 transition-all w-fit"
            >
              <Github size={16} />
              {t('contributeOnGitHub')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
