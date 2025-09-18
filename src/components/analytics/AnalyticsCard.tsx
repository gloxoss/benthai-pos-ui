import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const AnalyticsCard = ({
  title,
  value,
  change,
  icon,
  loading = false,
  className,
}: AnalyticsCardProps) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (!change) return null;
    
    if (change.value > 0) {
      return <TrendingUp className="h-3 w-3 text-benthai-red" />;
    } else if (change.value < 0) {
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    }
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (!change) return '';
    
    if (change.value > 0) {
      return 'text-benthai-red';
    } else if (change.value < 0) {
      return 'text-destructive';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={cn("flex items-center text-xs", getTrendColor())}>
            {getTrendIcon()}
            <span className="ml-1">
              {change.value > 0 ? '+' : ''}{change.value}% from {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};