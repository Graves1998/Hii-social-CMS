import { ContentItem, ContentStatus } from '@/shared/types';
import React from 'react';
import ContentColumn from './content-column';
import TableRow from './content-row';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: ContentItem) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const ContentTable: React.FC<ContentTableProps> = ({
  items,
  onView,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
}) => {
  // Only count pending items for select all
  const pendingItems = items.filter((item) => item.status === ContentStatus.PENDING_REVIEW);
  const allSelected =
    pendingItems.length > 0 &&
    pendingItems.every((item) => selectedIds.includes(item.id.toString()));
  const hasPendingItems = pendingItems.length > 0;

  return (
    <>
      <div className="w-full border border-white/10 bg-black">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <ContentColumn
                allSelected={allSelected}
                onToggleAll={onToggleAll}
                hasPendingItems={hasPendingItems}
              />
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <TableRow
                  item={item}
                  key={item.content_id}
                  selectedIds={selectedIds}
                  onView={() => onView(item)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
              {items.length === 0 && <EmptyState />}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infinite Scroll Trigger */}
      {loadMoreRef && (
        <div ref={loadMoreRef} className="flex justify-center border-t border-white/10 py-8">
          {isFetchingNextPage && <LoadingState />}
          {!isFetchingNextPage && hasNextPage && (
            <div className="font-mono text-xs text-zinc-600 uppercase">SCROLL_TO_LOAD_MORE</div>
          )}
        </div>
      )}
    </>
  );
};

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={6}
        className="p-8 text-center align-middle font-mono text-xs text-zinc-600 uppercase"
      >
        Không có dữ liệu hiển thị.
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-white uppercase">
      <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <span>ĐANG_TẢI...</span>
    </div>
  );
}

export default ContentTable;
