import { useState, useCallback } from 'react';
import type { WizardAnswers } from '../data/wizard';
import { steps, getRecommendedStack } from '../data/wizard';

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
  testing: 'vitest-playwright',
  monitoring: 'sentry',
};

export function useWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

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
  }, [answers]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

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
  }, [currentStep, answers]);

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
