import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Menu, X, ChevronRight, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { chapters } from '../data/docs';

export default function Docs() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const currentChapter = slug
    ? chapters.find((c) => c.slug === slug)
    : chapters[0];

  const chapterIndex = currentChapter
    ? chapters.findIndex((c) => c.slug === currentChapter.slug)
    : 0;

  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  useEffect(() => {
    if (!slug) {
      navigate(`/docs/${chapters[0].slug}`, { replace: true });
    }
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const sections = contentRef.current.querySelectorAll('[data-section-id]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.getAttribute('data-section-id') || '');
        }
      });
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll, { passive: true });
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [currentChapter]);

  useEffect(() => {
    setSidebarOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [slug]);

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let key = 0;

    const flushCode = () => {
      if (codeContent) {
        elements.push(
          <pre key={`code-${key++}`} className="my-4 p-4 rounded-lg bg-[#0B0C10] border border-white/5 overflow-x-auto">
            <code className="font-mono text-sm text-[#C792EA]">
              {codeContent.trim()}
            </code>
          </pre>
        );
        codeContent = '';
      }
    };

    lines.forEach((line) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCode();
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          // eslint-disable-next-line no-empty
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${key++}`} className="font-display text-3xl md:text-4xl text-[#F0F2F5] uppercase mt-12 mb-6">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${key++}`} className="font-heading text-2xl font-semibold text-[#F0F2F5] mt-10 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${key++}`} className="font-heading text-xl font-semibold text-[#F0F2F5] mt-8 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`bq-${key++}`} className="my-4 pl-4 border-l-2 border-cyan text-[#8B92A8] italic">
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${key++}`} className="flex items-start gap-2 text-[#8B92A8] my-1">
            <span className="text-cyan mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
            <span>{line.replace('- ', '')}</span>
          </li>
        );
      } else if (line.startsWith('| ')) {
        // Skip table separator lines
        if (!line.includes('---')) {
          const cells = line.split('|').filter(Boolean).map((c) => c.trim());
          if (cells.length > 0) {
            elements.push(
              <div key={`tr-${key++}`} className="flex border-b border-white/5 text-sm">
                {cells.map((cell, i) => (
                  <div key={i} className={`flex-1 px-3 py-2 ${i === 0 ? 'text-[#F0F2F5] font-heading font-medium' : 'text-[#8B92A8]'}`}>
                    {cell}
                  </div>
                ))}
              </div>
            );
          }
        }
      } else if (line.match(/^\*\*(.+?)\*\*$/)) {
        elements.push(
          <p key={`bold-${key++}`} className="font-heading font-semibold text-[#F0F2F5] my-3">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.trim() === '') {
        // Skip empty lines
      } else {
        // Parse inline bold
        const parsed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#F0F2F5]">$1</strong>');
        elements.push(
          <p key={`p-${key++}`} className="text-[#8B92A8] my-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
        );
      }
    });

    if (inCodeBlock) flushCode();
    return elements;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#0B0C10' }}>
      <Navigation />

      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Toggle */}
        <button
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-cyan text-[#0B0C10] flex items-center justify-center shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 w-72 h-[calc(100dvh-4rem)] overflow-y-auto border-r border-white/5 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ background: 'rgba(11, 12, 16, 0.95)' }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 text-cyan mb-6">
              <BookOpen size={18} />
              <span className="font-heading text-sm font-semibold">Contents</span>
            </div>

            <nav className="space-y-1">
              {chapters.map((chapter) => {
                const isActive = currentChapter?.slug === chapter.slug;
                return (
                  <div key={chapter.slug}>
                    <Link
                      to={`/docs/${chapter.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-cyan/10 text-cyan font-medium'
                          : 'text-[#8B92A8] hover:text-[#F0F2F5] hover:bg-white/5'
                      }`}
                    >
                      <ChevronRight size={14} className={`transition-transform ${isActive ? 'rotate-90' : ''}`} />
                      {chapter.title}
                    </Link>

                    {isActive && chapter.sections.length > 0 && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {chapter.sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => {
                              const el = document.querySelector(`[data-section-id="${section.id}"]`);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`block w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                              activeSection === section.id
                                ? 'text-cyan'
                                : 'text-[#8B92A8]/70 hover:text-[#8B92A8]'
                            }`}
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto h-[calc(100dvh-4rem)]"
        >
          {currentChapter && (
            <article className="max-w-3xl mx-auto px-6 py-12">
              {/* Chapter Header */}
              <header className="mb-10 pb-8 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#8B92A8] text-sm mb-4">
                  <BookOpen size={14} />
                  <span>Chapter {chapterIndex + 1} of {chapters.length}</span>
                  <span className="mx-2">&middot;</span>
                  <Clock size={14} />
                  <span>{currentChapter.sections.length * 5} min read</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl text-[#F0F2F5] uppercase">
                  {currentChapter.title}
                </h1>
                <p className="mt-3 text-[#8B92A8] text-lg">
                  {currentChapter.description}
                </p>
              </header>

              {/* Sections */}
              {currentChapter.sections.map((section) => (
                <div
                  key={section.id}
                  data-section-id={section.id}
                  className="mb-12"
                >
                  <h2 className="font-heading text-2xl font-semibold text-[#F0F2F5] mb-4">
                    {section.title}
                  </h2>
                  <div className="docs-content">
                    {renderMarkdown(section.content)}
                  </div>
                </div>
              ))}

              {/* Navigation Footer */}
              <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                {prevChapter ? (
                  <Link
                    to={`/docs/${prevChapter.slug}`}
                    className="flex items-center gap-2 text-[#8B92A8] hover:text-cyan transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <div>
                      <div className="text-xs">Previous</div>
                      <div className="font-heading text-sm">{prevChapter.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {nextChapter ? (
                  <Link
                    to={`/docs/${nextChapter.slug}`}
                    className="flex items-center gap-2 text-[#8B92A8] hover:text-cyan transition-colors text-right"
                  >
                    <div>
                      <div className="text-xs">Next</div>
                      <div className="font-heading text-sm">{nextChapter.title}</div>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </article>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
