import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowRight, Check, Sparkles, Info, List,
  Layout, Server, Database, Shield, Cloud, Plus, Wand2,
  Lightbulb, ChevronRight, Zap,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useWizard } from '../hooks/useWizard';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { useI18n } from '../i18n/useI18n';
import { useNamespace } from '../i18n/useNamespace';
import { getWizardData } from '../i18n/localizers/wizard';
import wizardPage from '../i18n/translations/wizardPage';

const stepIcons: Record<string, React.ReactNode> = {
  info: <Info size={16} />,
  list: <List size={16} />,
  layout: <Layout size={16} />,
  server: <Server size={16} />,
  database: <Database size={16} />,
  shield: <Shield size={16} />,
  cloud: <Cloud size={16} />,
  plus: <Plus size={16} />,
  check: <Check size={16} />,
};

export default function Wizard() {
  const wizard = useWizard();
  const navigate = useNavigate();
  const { locale } = useI18n();
  const { t } = useNamespace(wizardPage);
  const { questions, steps, comparisons, getRecommendedStack } = getWizardData(locale);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const stepQuestions = questions.filter((q) => q.step === wizard.currentStepId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [wizard.currentStep]);

  // Redirect to the generator once the wizard is complete
  useEffect(() => {
    if (wizard.isLastStep) {
      navigate('/generator', { state: { answers: wizard.answers } });
    }
  }, [wizard.isLastStep, wizard.answers, navigate]);

  const handleApplyRecommendations = () => {
    wizard.applyRecommendations();
    setShowRecommendations(false);
  };

  if (wizard.isLastStep) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#0B0C10' }}>
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[#8B92A8] hover:text-cyan text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              {t('backToHome')}
            </Link>
            <div className="flex items-center gap-3">
              <h1
                className="font-display text-[#F0F2F5] uppercase"
                style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}
              >
                {t('title')}
              </h1>
              <div className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                <span className="text-cyan text-xs font-heading">{t('badge')}</span>
              </div>
            </div>
            <p className="mt-2 text-[#8B92A8]">
              {t('intro')}
            </p>
            <Alert className="mt-4 border-cyan/20 bg-cyan/5">
              <Info className="h-4 w-4 text-cyan" />
              <AlertTitle className="text-cyan font-heading">{t('alertTitle')}</AlertTitle>
              <AlertDescription className="text-[#8B92A8]">
                {t('alertDescription')}
              </AlertDescription>
            </Alert>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8B92A8] font-heading">
                {t('stepOf', { current: wizard.currentStep + 1, total: steps.length })}
              </span>
              <span className="text-xs text-cyan font-heading">
                {t('percent', { progress: Math.round(wizard.progress) })}
              </span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan to-purple-code rounded-full transition-all duration-500"
                style={{ width: `${wizard.progress}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="mt-4 flex gap-1 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => index <= wizard.currentStep && wizard.goToStep(index)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading whitespace-nowrap transition-all ${
                    index === wizard.currentStep
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : index < wizard.currentStep
                      ? 'bg-cyan/5 text-cyan/60 border border-cyan/10'
                      : 'bg-surface text-[#8B92A8]/40 border border-white/5'
                  } ${index <= wizard.currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {stepIcons[step.icon]}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questions Column */}
            <div className="lg:col-span-2 space-y-6">
              {wizard.currentStepId === 'project-info' && (
                <ProjectInfoStep wizard={wizard} questions={questions} />
              )}
              {wizard.currentStepId === 'requirements' && (
                <RequirementsStep wizard={wizard} questions={questions} />
              )}
              {['frontend', 'backend', 'database', 'auth', 'hosting'].includes(wizard.currentStepId) && (
                <TechSelectStep
                  wizard={wizard}
                  questions={stepQuestions}
                />
              )}
              {wizard.currentStepId === 'extras' && (
                <ExtrasStep wizard={wizard} questions={stepQuestions} />
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button
                  onClick={wizard.prevStep}
                  disabled={wizard.isFirstStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading text-sm transition-all ${
                    wizard.isFirstStep
                      ? 'opacity-30 cursor-not-allowed text-[#8B92A8]'
                      : 'text-[#F0F2F5] hover:bg-white/5'
                  }`}
                >
                  <ArrowLeft size={16} />
                  {t('previous')}
                </button>

                <button
                  onClick={wizard.nextStep}
                  disabled={!wizard.canProceed()}
                  className={`group flex items-center gap-2 px-8 py-3 rounded-full font-heading text-sm font-semibold transition-all ${
                    wizard.canProceed()
                      ? 'bg-cyan text-[#0B0C10] hover:bg-cyan/90 hover:glow-cyan'
                      : 'bg-surface text-[#8B92A8] cursor-not-allowed'
                  }`}
                >
                  {wizard.currentStep === steps.length - 2 ? (
                    <>
                      <Wand2 size={16} />
                      {t('generateSetup')}
                    </>
                  ) : (
                    <>
                      {t('next')}
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar: Recommendations & Comparisons */}
            <div className="space-y-6">
              {/* Smart Recommendations */}
              {wizard.currentStep >= 2 && wizard.currentStep <= 7 && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-cyan/5 to-purple-code/5 border border-cyan/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-cyan" />
                    <h3 className="font-heading text-sm font-semibold text-[#F0F2F5]">
                      {t('smartRecommendation')}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8B92A8] mb-3">
                    {t('basedOnProjectType', { projectType: wizard.answers.projectType })}
                  </p>
                  {!showRecommendations ? (
                    <button
                      onClick={() => setShowRecommendations(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan/10 text-cyan text-xs font-heading hover:bg-cyan/20 transition-colors"
                    >
                      <Sparkles size={14} />
                      {t('showRecommendations')}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        const recs = getRecommendedStack(wizard.answers);
                        const currentStep = wizard.currentStepId;
                        const recKey = currentStep === 'frontend' ? 'frontend'
                          : currentStep === 'backend' ? 'backend'
                          : currentStep === 'database' ? 'database'
                          : currentStep === 'auth' ? 'auth'
                          : currentStep === 'hosting' ? 'hosting'
                          : null;
                        const recValue = recKey ? recs[recKey as keyof typeof recs] : null;
                        const recQuestion = questions.find(q => q.id === recKey);
                        const recOption = recQuestion?.options.find(o => o.value === recValue);

                        return recKey && recOption ? (
                          <div>
                            <div className="text-sm font-heading text-cyan mb-1">{recOption.label}</div>
                            <p className="text-xs text-[#8B92A8]">{recOption.description}</p>
                            <button
                              onClick={handleApplyRecommendations}
                              className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan text-[#0B0C10] text-xs font-heading hover:bg-cyan/90 transition-colors"
                            >
                              <Zap size={12} />
                              {t('applyAll')}
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-[#8B92A8]">
                            <div className="space-y-1">
                              <div>Frontend: <span className="text-cyan">{recs.frontend}</span></div>
                              <div>Backend: <span className="text-cyan">{recs.backend}</span></div>
                              <div>Database: <span className="text-cyan">{recs.database}</span></div>
                              <div>Auth: <span className="text-cyan">{recs.auth}</span></div>
                              <div>Hosting: <span className="text-cyan">{recs.hosting}</span></div>
                            </div>
                            <button
                              onClick={handleApplyRecommendations}
                              className="mt-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan text-[#0B0C10] text-xs font-heading hover:bg-cyan/90 transition-colors"
                            >
                              <Zap size={12} />
                              {t('applyAllRecommendations')}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Tech Comparisons */}
              {wizard.currentStepId === 'database' && (
                <ComparisonCard comparison={comparisons[0]} />
              )}
              {wizard.currentStepId === 'hosting' && (
                <ComparisonCard comparison={comparisons[1]} />
              )}
              {wizard.currentStepId === 'auth' && (
                <ComparisonCard comparison={comparisons[2]} />
              )}

              {/* Current Summary */}
              {wizard.currentStep > 0 && (
                <div className="p-5 rounded-xl bg-surface/50 border border-white/5">
                  <h3 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
                    {t('currentSetup')}
                  </h3>
                  <div className="space-y-2 text-xs">
                    {wizard.answers.projectName && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryProject')}</span>
                        <span className="text-[#F0F2F5]">{wizard.answers.projectName}</span>
                      </div>
                    )}
                    {wizard.answers.projectType && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryType')}</span>
                        <span className="text-[#F0F2F5]">{wizard.answers.projectType}</span>
                      </div>
                    )}
                    {wizard.answers.frontend && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryFrontend')}</span>
                        <span className="text-cyan">{wizard.answers.frontend}</span>
                      </div>
                    )}
                    {wizard.answers.backend && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryBackend')}</span>
                        <span className="text-cyan">{wizard.answers.backend}</span>
                      </div>
                    )}
                    {wizard.answers.database && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryDatabase')}</span>
                        <span className="text-cyan">{wizard.answers.database}</span>
                      </div>
                    )}
                    {wizard.answers.auth && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryAuth')}</span>
                        <span className="text-cyan">{wizard.answers.auth}</span>
                      </div>
                    )}
                    {wizard.answers.hosting && (
                      <div className="flex justify-between">
                        <span className="text-[#8B92A8]">{t('summaryHosting')}</span>
                        <span className="text-cyan">{wizard.answers.hosting}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ============================================================
// STEP COMPONENTS
// ============================================================

function ProjectInfoStep({
  wizard,
  questions,
}: {
  wizard: ReturnType<typeof useWizard>;
  questions: ReturnType<typeof getWizardData>['questions'];
}) {
  const { t } = useNamespace(wizardPage);

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-2">
          {t('projectNameLabel')}
        </label>
        <input
          type="text"
          value={wizard.answers.projectName}
          onChange={(e) => wizard.updateAnswer('projectName', e.target.value)}
          placeholder={t('projectNamePlaceholder')}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-[#F0F2F5] placeholder-[#8B92A8]/40 focus:outline-none focus:border-cyan/40 transition-colors"
        />
      </div>

      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-2">
          {t('descriptionLabel')}
        </label>
        <input
          type="text"
          value={wizard.answers.projectDescription}
          onChange={(e) => wizard.updateAnswer('projectDescription', e.target.value)}
          placeholder={t('descriptionPlaceholder')}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-[#F0F2F5] placeholder-[#8B92A8]/40 focus:outline-none focus:border-cyan/40 transition-colors"
        />
      </div>

      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
          {t('projectTypeLabel')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questions.find((q) => q.id === 'projectType')?.options.map((option) => (
            <button
              key={option.value}
              onClick={() => wizard.updateAnswer('projectType', option.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                wizard.answers.projectType === option.value
                  ? 'border-cyan/40 bg-cyan/5'
                  : 'border-white/5 bg-surface/50 hover:border-white/10'
              }`}
            >
              <div className="font-heading text-sm text-[#F0F2F5]">{option.label}</div>
              <div className="text-xs text-[#8B92A8] mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequirementsStep({
  wizard,
  questions,
}: {
  wizard: ReturnType<typeof useWizard>;
  questions: ReturnType<typeof getWizardData>['questions'];
}) {
  const features = wizard.answers.features || [];
  const featuresQuestion = questions.find((q) => q.id === 'features');
  const timelineQuestion = questions.find((q) => q.id === 'timeline');
  const teamSizeQuestion = questions.find((q) => q.id === 'teamSize');

  const toggleFeature = (value: string) => {
    const current = new Set(features);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    wizard.updateAnswer('features', Array.from(current));
  };

  return (
    <div className="space-y-8">
      {/* Features */}
      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-1">
          {featuresQuestion?.question}
        </label>
        <p className="text-xs text-[#8B92A8] mb-3">{featuresQuestion?.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {featuresQuestion?.options.map((option) => {
            const isSelected = features.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleFeature(option.value)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan/40 bg-cyan/5'
                    : 'border-white/5 bg-surface/50 hover:border-white/10'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'bg-cyan border-cyan' : 'border-[#8B92A8]/30'
                  }`}
                >
                  {isSelected && <Check size={12} className="text-[#0B0C10]" />}
                </div>
                <div>
                  <div className="font-heading text-sm text-[#F0F2F5]">{option.label}</div>
                  <div className="text-xs text-[#8B92A8]">{option.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
          {timelineQuestion?.question}
        </label>
        <div className="flex flex-wrap gap-2">
          {timelineQuestion?.options.map((option) => (
            <button
              key={option.value}
              onClick={() => wizard.updateAnswer('timeline', option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-heading transition-all ${
                wizard.answers.timeline === option.value
                  ? 'bg-cyan text-[#0B0C10]'
                  : 'bg-surface text-[#8B92A8] border border-white/10 hover:border-cyan/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Size */}
      <div>
        <label className="block font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
          {teamSizeQuestion?.question}
        </label>
        <div className="flex flex-wrap gap-2">
          {teamSizeQuestion?.options.map((option) => (
            <button
              key={option.value}
              onClick={() => wizard.updateAnswer('teamSize', option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-heading transition-all ${
                wizard.answers.teamSize === option.value
                  ? 'bg-cyan text-[#0B0C10]'
                  : 'bg-surface text-[#8B92A8] border border-white/10 hover:border-cyan/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechSelectStep({
  wizard,
  questions: qs,
}: {
  wizard: ReturnType<typeof useWizard>;
  questions: ReturnType<typeof getWizardData>['questions'];
}) {
  const answerKey = qs[0]?.id as keyof typeof wizard.answers;
  const selected = wizard.answers[answerKey] as string;

  return (
    <div className="space-y-6">
      {qs.map((q) => (
        <div key={q.id}>
          <h2 className="font-heading text-xl font-semibold text-[#F0F2F5] mb-1">
            {q.question}
          </h2>
          {q.description && (
            <p className="text-sm text-[#8B92A8] mb-4">{q.description}</p>
          )}
          <div className="space-y-3">
            {q.options.map((option) => (
              <button
                key={option.value}
                onClick={() => wizard.updateAnswer(answerKey, option.value)}
                className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                  selected === option.value
                    ? 'border-cyan/40 bg-cyan/5'
                    : 'border-white/5 bg-surface/50 hover:border-white/10'
                }`}
              >
                <div
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected === option.value
                      ? 'border-cyan'
                      : 'border-[#8B92A8]/30'
                  }`}
                >
                  {selected === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-heading text-sm font-semibold text-[#F0F2F5]">
                    {option.label}
                  </div>
                  <div className="text-xs text-[#8B92A8] mt-1 leading-relaxed">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExtrasStep({
  wizard,
  questions: qs,
}: {
  wizard: ReturnType<typeof useWizard>;
  questions: ReturnType<typeof getWizardData>['questions'];
}) {
  return (
    <div className="space-y-8">
      {qs.map((q) => (
        <div key={q.id}>
          <h2 className="font-heading text-lg font-semibold text-[#F0F2F5] mb-1">
            {q.question}
          </h2>
          <p className="text-xs text-[#8B92A8] mb-3">{q.description}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((option) => {
              const answerKey = q.id as keyof typeof wizard.answers;
              const isSelected = wizard.answers[answerKey] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => wizard.updateAnswer(answerKey, option.value)}
                  className={`px-4 py-2.5 rounded-full text-sm font-heading transition-all ${
                    isSelected
                      ? 'bg-cyan text-[#0B0C10]'
                      : 'bg-surface text-[#8B92A8] border border-white/10 hover:border-cyan/30'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparisonCard({ comparison }: { comparison: ReturnType<typeof getWizardData>['comparisons'][number] }) {
  const { t } = useNamespace(wizardPage);
  const [activeTab, setActiveTab] = useState(0);
  const tech = comparison.technologies[activeTab];

  return (
    <div className="p-5 rounded-xl bg-surface/50 border border-white/5">
      <h3 className="font-heading text-sm font-semibold text-[#F0F2F5] mb-3">
        {comparison.category}
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {comparison.technologies.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActiveTab(i)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-heading transition-all ${
              i === activeTab
                ? 'bg-cyan/10 text-cyan'
                : 'text-[#8B92A8] hover:text-[#F0F2F5]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-xs text-[#8B92A8]">{tech.bestFor}</p>

        <div>
          <div className="text-xs font-heading text-mint-code mb-1">{t('comparisonPros')}</div>
          {tech.pros.map((pro, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-[#8B92A8]">
              <ChevronRight size={10} className="text-mint-code mt-0.5 flex-shrink-0" />
              {pro}
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs font-heading text-red-400 mb-1">{t('comparisonCons')}</div>
          {tech.cons.map((con, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-[#8B92A8]">
              <ChevronRight size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
              {con}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/5">
          <span className="text-xs text-[#8B92A8]">{tech.pricing}</span>
        </div>
      </div>
    </div>
  );
}

// Type helper
