import Navigation from '../components/Navigation';
import CustomCursor from '../components/CustomCursor';
import KonamiEasterEgg from '../components/KonamiEasterEgg';
import Footer from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import WorkflowSection from '../sections/WorkflowSection';
import ToolMatrixSection from '../sections/ToolMatrixSection';
import ContextEngineeringSection from '../sections/ContextEngineeringSection';
import ChecklistSection from '../sections/ChecklistSection';
import FeaturesSection from '../sections/FeaturesSection';
import CLISection from '../sections/CLISection';
import VSCodeSection from '../sections/VSCodeSection';

export default function Home() {
  return (
    <div className="min-h-[100dvh]" style={{ background: '#0B0C10' }}>
      <KonamiEasterEgg />
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <WorkflowSection />
        <ToolMatrixSection />
        <ContextEngineeringSection />
        <ChecklistSection />
        <FeaturesSection />
        <CLISection />
        <VSCodeSection />
      </main>
      <Footer />
    </div>
  );
}
