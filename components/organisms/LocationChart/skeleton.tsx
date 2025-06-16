import { Skeleton } from '@/components/atoms/Skeleton';

export function ChartSkeleton() {
  return (
    <div className="h-96 flex flex-row gap-4">
      <div className="flex-1 h-64 flex items-center justify-center">
        <div className="relative">
          <Skeleton width="14rem" height="14rem" className="rounded-full" />
          <div className="absolute inset-4">
            <Skeleton width="10rem" height="10rem" className="rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-none space-y-2 pt-6">
        {[12, 10, 8, 6, 5, 4].map((width, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton width="0.75rem" height="0.75rem" className="rounded-full" />
            <Skeleton width={`${width}rem`} height="1rem" />
          </div>
        ))}
      </div>
    </div>
  );
}
