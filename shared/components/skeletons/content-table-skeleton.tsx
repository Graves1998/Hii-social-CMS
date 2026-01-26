import { TableRowSkeleton } from './table-row-skeleton';

interface ContentTableSkeletonProps {
  rows?: number;
}

/**
 * Content Table Skeleton
 * Shows multiple TableRowSkeleton in table layout
 */
export function ContentTableSkeleton({ rows = 10 }: ContentTableSkeletonProps) {
  return (
    <div className="overflow-hidden border border-white/10 bg-black/50">
      <table className="w-full">
        <thead className="border-b border-white/20 bg-black/80">
          <tr>
            <th className="p-3 text-left">
              <div className="h-4 w-4 bg-white/10" />
            </th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Thumbnail</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Content</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Category</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Platform</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Status</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Date</th>
            <th className="p-3 text-left font-mono text-xs text-zinc-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={`table-row-skeleton-${index + 1}`} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
