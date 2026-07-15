import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Github } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Wizard', href: '/wizard' },
  { label: 'Optimize', href: '/optimize' },
  { label: 'Prompts', href: '/prompts' },
  { label: 'Tools', href: '/tools' },
  { label: 'Templates', href: '/templates' },
];

export default function Navigation() {
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
        <Link to="/" className="font-heading text-sm tracking-[0.2em] text-[#F0F2F5] hover:text-cyan transition-colors">
          THE VIBE CODING HANDBOOK
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

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="https://github.com/dangelBorges/the-vibecoding-handbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 border border-cyan/60 text-cyan text-sm font-heading rounded-full hover:bg-cyan/10 hover:glow-cyan transition-all duration-300"
          >
            <Github size={16} />
            Contribute
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
            <a
              href="https://github.com/dangelBorges/the-vibecoding-handbook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-cyan/60 text-cyan text-sm font-heading rounded-full hover:bg-cyan/10 transition-all w-fit"
            >
              <Github size={16} />
              Contribute on GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
