import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { HashRouter } from 'react-router'
import '@fontsource/syncopate/700.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/jetbrains-mono/400.css'
import './index.css'
import App from './App.tsx'
import { ScrollToTop } from './hooks/useScrollToTop'
import { I18nProvider } from './i18n/I18nProvider'

function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center" style={{ background: '#0B0C10' }}>
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-cyan/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan animate-spin" />
      </div>
      <p className="text-[#8B92A8] text-sm font-heading">Loading...</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <I18nProvider>
      <Suspense fallback={<LoadingFallback />}>
        <ScrollToTop />
        <App />
      </Suspense>
    </I18nProvider>
  </HashRouter>,
)
