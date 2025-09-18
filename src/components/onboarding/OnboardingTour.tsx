import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useLanguage } from '@/hooks/useLanguage';

interface OnboardingTourProps {
  steps: Step[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour = ({
  steps,
  isOpen,
  onComplete,
  onSkip,
}: OnboardingTourProps) => {
  const [run, setRun] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setRun(true);
    }
  }, [isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (status === STATUS.FINISHED) {
        onComplete();
      } else {
        onSkip();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContent: {
          textAlign: isRTL ? 'right' : 'left',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: isRTL ? 0 : 'auto',
          marginLeft: isRTL ? 'auto' : 0,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      locale={{
        back: t('onboarding.back') || 'Back',
        close: t('common.close') || 'Close',
        last: t('onboarding.finish') || 'Finish',
        next: t('onboarding.next') || 'Next',
        skip: t('onboarding.skip') || 'Skip',
      }}
    />
  );
};