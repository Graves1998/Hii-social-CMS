import React from 'react';
import { Video, Image as ImageIcon, Type, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { ContentItem, ContentStatus, MediaType } from '@/shared/types';
import { STATUS_LABELS } from '@/features/content/constants';
import { Button } from '@/shared/ui';
import TableRow from './content-row';
import ContentColumn from './content-column';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  items,
  onView,
  selectedIds,
  onToggleSelect,
  onToggleAll,
}) => {
  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.content_id));

  return (
    <div className="w-full border border-white/10 bg-black">
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <ContentColumn allSelected={allSelected} onToggleAll={onToggleAll} />
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <TableRow
                item={item}
                key={item.content_id}
                selectedIds={selectedIds}
                onView={onView}
                onToggleSelect={onToggleSelect}
              />
            ))}
            {items.length === 0 && <EmptyState />}
          </tbody>
        </table>
      </div>
    </div>
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

export default ContentTable;
