import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    // Trigger a network check by trying to fetch a small resource
    fetch('/favicon.ico', { method: 'HEAD' })
      .then(() => {
        setIsOnline(true);
        setShowBanner(false);
      })
      .catch(() => {
        setIsOnline(false);
        setShowBanner(true);
      });
  };

  if (!showBanner) return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-destructive text-destructive-foreground">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div>
          <strong>{t('offline.title')}</strong>
          <span className="ml-2">{t('offline.message')}</span>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="border-destructive-foreground text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive"
          >
            <Wifi className="h-3 w-3 mr-1" />
            {t('offline.retry')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};