
import React from 'react';
import { ContentItem, ContentStatus, MediaType } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { Eye, Video, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: string) => void;
}

const MediaIcon = ({ type }: { type: MediaType }) => {
  switch (type) {
    case MediaType.VIDEO: return <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Video size={16} /></div>;
    case MediaType.IMAGE: return <div className="p-2 bg-green-100 rounded-lg text-green-600"><ImageIcon size={16} /></div>;
    case MediaType.TEXT: return <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Type size={16} /></div>;
    case MediaType.LINK: return <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><LinkIcon size={16} /></div>;
    default: return null;
  }
};

const ContentTable: React.FC<ContentTableProps> = ({ items, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/20">
        <thead>
          <tr className="bg-white/10">
            <th className="px-8 py-5 text-left text-xs font-black text-navy uppercase tracking-widest">Thông Tin</th>
            <th className="px-8 py-5 text-left text-xs font-black text-navy uppercase tracking-widest">Danh Mục</th>
            <th className="px-8 py-5 text-left text-xs font-black text-navy uppercase tracking-widest">Tài Sản</th>
            <th className="px-8 py-5 text-left text-xs font-black text-navy uppercase tracking-widest">Nguồn</th>
            <th className="px-8 py-5 text-left text-xs font-black text-navy uppercase tracking-widest">Trạng Thái</th>
            <th className="relative py-5 px-8">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((item) => (
            <tr key={item.content_id} className="hover:bg-white/30 transition-all duration-200 cursor-pointer" onClick={() => onView(item.content_id)}>
              <td className="px-8 py-6">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-navy truncate max-w-[240px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-brand-blue font-bold uppercase tracking-tight">ID: {item.content_id} • Bởi {item.created_by}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-8 py-6">
                <span className="inline-flex items-center rounded-xl bg-white/40 px-4 py-1.5 text-[10px] font-black text-navy uppercase tracking-widest border border-white/50">
                  {item.category}
                </span>
              </td>
              <td className="whitespace-nowrap px-8 py-6">
                <div className="flex items-center gap-3">
                  <MediaIcon type={item.media_type} />
                  <span className="text-xs font-bold text-slate-700 capitalize">{item.media_type}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-blue uppercase">{item.source_platform}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">{item.source_type}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-8 py-6">
                <span className={`inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${STATUS_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-6 px-8 text-right">
                <button
                  onClick={(e) => { e.stopPropagation(); onView(item.content_id); }}
                  className="text-brand-orange hover:bg-brand-orange hover:text-white p-3 rounded-2xl transition-all shadow-lg shadow-brand-orange/5"
                >
                  <Eye size={20} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="px-8 py-20 text-center text-sm font-black text-brand-blue/60 italic uppercase tracking-widest">
                Không tìm thấy nội dung phù hợp trong hệ thống.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
