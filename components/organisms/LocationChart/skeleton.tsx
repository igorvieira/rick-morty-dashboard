import { Skeleton } from '@/components/atoms/Skeleton';

export function ChartSkeleton() {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="space-y-4 w-full">
        <Skeleton width="60%" height="2rem" className="mx-auto" />
        <div className="flex justify-center">
          <Skeleton width="16rem" height="16rem" className="rounded-full" />
        </div>
        <div className="flex justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width="1rem" height="1rem" />
              <Skeleton width="4rem" height="1rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
