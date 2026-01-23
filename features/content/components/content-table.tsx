import React from 'react';
import { Video, Image as ImageIcon, Type, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { ContentItem, ContentStatus, MediaType } from '@/shared/types';
import { STATUS_LABELS } from '@/features/content/constants';
import { Button } from '@/shared/ui';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

function MediaIcon({ type }: { type: MediaType }) {
  switch (type) {
    case MediaType.VIDEO:
      return <Video size={14} className="text-zinc-400" />;
    case MediaType.IMAGE:
      return <ImageIcon size={14} className="text-zinc-400" />;
    case MediaType.TEXT:
      return <Type size={14} className="text-zinc-400" />;
    case MediaType.LINK:
      return <LinkIcon size={14} className="text-zinc-400" />;
    default:
      return null;
  }
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
            <tr className="border-b border-white/10">
              <th className="h-10 w-[50px] px-6 text-left align-middle">
                <input
                  type="checkbox"
                  className="h-3 w-3 cursor-pointer rounded-none border-zinc-700 bg-transparent accent-white"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                Tài Nguyên
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                Loại
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                Nguồn
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                Trạng Thái
              </th>
              <th className="h-10 px-6 text-right align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr
                key={item.content_id}
                className={`group cursor-pointer transition-colors hover:bg-[#111] ${selectedIds.includes(item.content_id) ? 'bg-white/5' : ''}`}
                onClick={() => onView(item.content_id)}
              >
                <td className="p-6 align-middle" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-3 w-3 cursor-pointer rounded-none border-zinc-700 bg-transparent accent-white"
                    checked={selectedIds.includes(item.content_id)}
                    onChange={() => onToggleSelect(item.content_id)}
                  />
                </td>
                <td className="p-6 align-middle">
                  <div className="flex max-w-[300px] flex-col">
                    <span className="mb-1 truncate font-bold text-white transition-colors group-hover:text-white">
                      {item.title}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600 uppercase">
                      ID: {item.content_id}
                    </span>
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="flex items-center gap-2">
                    <MediaIcon type={item.media_type} />
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">
                      {item.category}
                    </span>
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="font-mono text-[10px] text-zinc-400 uppercase">
                    {item.source_platform}
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="inline-block border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-300 uppercase">
                    {STATUS_LABELS[item.status]}
                  </div>
                </td>
                <td className="p-6 text-right align-middle">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none text-zinc-600 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center align-middle font-mono text-xs text-zinc-600 uppercase"
                >
                  Không có dữ liệu hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentTable;
