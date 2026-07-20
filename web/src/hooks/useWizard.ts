import { useState, useCallback } from 'react';
import type { WizardAnswers } from '../data/wizard';
import { useI18n } from '../i18n/useI18n';
import { getWizardData } from '../i18n/localizers/wizard';
import { requestLLMRecommendations } from '../utils/llm';

const initialAnswers: WizardAnswers = {
  projectName: '',
  projectDescription: '',
  projectType: 'saas',
  features: [],
  timeline: 'month',
  teamSize: 'solo',
  frontend: '',
  backend: '',
  database: '',
  auth: '',
  hosting: '',
  payments: 'none',
  email: 'none',
  storage: 'none',
  realtime: false,
  testing: 'minimal',
  monitoring: 'none',
};

export function useWizard() {
  const { locale } = useI18n();
  const { steps, getRecommendedStack } = getWizardData(locale);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [llmRationale, setLlmRationale] = useState('');
  const [isLoadingLLM, setIsLoadingLLM] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  const currentStepId = steps[currentStep]?.id || 'project-info';

  const updateAnswer = useCallback(<K extends keyof WizardAnswers>(
    key: K,
    value: WizardAnswers[K]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyRecommendations = useCallback(() => {
    const recs = getRecommendedStack(answers);
    setAnswers((prev) => ({
      ...prev,
      frontend: recs.frontend,
      backend: recs.backend,
      database: recs.database,
      auth: recs.auth,
      hosting: recs.hosting,
    }));
    setLlmRationale('');
  }, [answers, getRecommendedStack]);

  const generateLLMRecommendations = useCallback(async () => {
    setIsLoadingLLM(true);
    setLlmError(null);
    try {
      const result = await requestLLMRecommendations(answers, locale);
      if (result.error || !result.recommendations) {
        setLlmError(result.error || 'AI recommendation failed');
        return;
      }
      setAnswers((prev) => ({
        ...prev,
        frontend: result.recommendations!.frontend,
        backend: result.recommendations!.backend,
        database: result.recommendations!.database,
        auth: result.recommendations!.auth,
        hosting: result.recommendations!.hosting,
      }));
      setLlmRationale(result.recommendations!.rationale);
    } catch {
      setLlmError('AI recommendation failed');
    } finally {
      setIsLoadingLLM(false);
    }
  }, [answers, locale]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    setDirection(index > currentStep ? 'forward' : 'backward');
    setCurrentStep(index);
  }, [currentStep]);

  const canProceed = useCallback(() => {
    const step = steps[currentStep];
    if (!step) return false;

    switch (step.id) {
      case 'project-info':
        return answers.projectName.length > 0 && answers.projectDescription.length > 0;
      case 'requirements':
        return answers.features.length > 0;
      case 'frontend':
        return !!answers.frontend;
      case 'backend':
        return !!answers.backend;
      case 'database':
        return !!answers.database;
      case 'auth':
        return !!answers.auth;
      case 'hosting':
        return !!answers.hosting;
      default:
        return true;
    }
  }, [currentStep, answers, steps]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return {
    currentStep,
    currentStepId,
    steps,
    answers,
    updateAnswer,
    applyRecommendations,
    generateLLMRecommendations,
    llmRationale,
    isLoadingLLM,
    llmError,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    isLastStep,
    isFirstStep,
    progress,
    direction,
  };
}
