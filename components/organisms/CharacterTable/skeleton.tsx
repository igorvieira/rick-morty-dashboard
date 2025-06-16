import { Skeleton } from '@/components/atoms/Skeleton';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
            <th className="px-6 py-4"><Skeleton height="1.25rem" /></th>
          </tr>Add commentMore actions
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton width="2.5rem" height="2.5rem" className="rounded-full" />
                  <Skeleton width="8rem" height="1rem" />
                </div>
              </td>
              <td className="px-6 py-4"><Skeleton width="4rem" height="1rem" /></td>
              <td className="px-6 py-4"><Skeleton width="5rem" height="1rem" /></td>
              <td className="px-6 py-4"><Skeleton width="4rem" height="1rem" /></td>
              <td className="px-6 py-4"><Skeleton width="7rem" height="1rem" /></td>
              <td className="px-6 py-4"><Skeleton width="7rem" height="1rem" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
