import React from 'react';
import { Play, FileText } from 'lucide-react';
import { ContentItem, MediaType } from '@/shared/types';
import { STATUS_LABELS } from '@/features/content/constants';

interface ContentGridProps {
  items: ContentItem[];
  onView: (id: string) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, onView }) => {
  return (
    <div className="grid grid-cols-1 gap-[2px] border border-white/10 bg-white/10 p-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isVideo = item.media_type === MediaType.VIDEO;

        return (
          <div
            key={item.content_id}
            onClick={() => onView(item.content_id)}
            className="group relative cursor-pointer overflow-hidden bg-black p-6 transition-colors hover:bg-[#111]"
          >
            {/* Hover Line */}
            <div className="absolute top-0 left-0 z-20 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

            {/* Meta */}
            <div className="mb-6 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span>ID: {item.content_id.split('-')[1] || item.content_id}</span>
              <span className="uppercase">
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Image/Media */}
            <div className="relative mb-6 aspect-[16/10] overflow-hidden border border-white/5 bg-[#111] transition-colors duration-500 group-hover:border-zinc-600">
              {isVideo || item.media_type === MediaType.IMAGE ? (
                <img
                  src={`https://picsum.photos/seed/${item.content_id}/400/250`}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-70 grayscale filter transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
                  <FileText
                    className="text-zinc-600 transition-colors group-hover:text-white"
                    size={32}
                  />
                </div>
              )}

              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-none border border-white/20 bg-black/50 backdrop-blur transition-all group-hover:bg-white/20">
                    <Play size={12} className="fill-white text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-white transition-colors group-hover:text-white">
                {item.title}
              </h3>
              <p className="mb-6 line-clamp-2 h-8 text-xs leading-relaxed text-zinc-500">
                {item.short_description}
              </p>

              <div className="inline-block border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-300 uppercase">
                {STATUS_LABELS[item.status]} / {item.source_platform}
              </div>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="col-span-full bg-black py-20 text-center">
          <p className="font-mono text-sm text-zinc-500 uppercase">KHÔNG TÌM THẤY TÍN HIỆU</p>
        </div>
      )}
    </div>
  );
};

export default ContentGrid;
