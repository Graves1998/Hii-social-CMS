
import React from 'react';
import { ContentItem, MediaType } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { Play, Eye, FileText, Box, Globe } from 'lucide-react';

interface ContentGridProps {
  items: ContentItem[];
  onView: (id: string) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, onView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const isVideo = item.media_type === MediaType.VIDEO;
        
        return (
          <div 
            key={item.content_id} 
            onClick={() => onView(item.content_id)}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-500 rounded-[32px] aspect-[9/16] ${
              isVideo 
              ? 'glass-card border-white/40 shadow-2xl hover:scale-[1.03]' 
              : 'bg-white/10 border border-white/20 hover:bg-white/20'
            }`}
          >
            {/* Thumbnail / Media Preview */}
            <div className="absolute inset-0 z-0">
              {isVideo ? (
                <img 
                  src={`https://picsum.photos/seed/${item.content_id}/400/711`} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-navy/60 text-off-white/40 p-6 text-center">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Xem Trước Bài Viết</p>
                </div>
              )}
              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
            </div>

            {/* Top Elements: Status Badge + Eye Icon */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${STATUS_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
              
              {isVideo && (
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-lg">
                  <Eye size={18} />
                </div>
              )}
            </div>

            {/* Central Play Indicator for Videos */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 scale-90 group-hover:scale-100 transition-all duration-500 group-hover:bg-brand-blue/40 shadow-2xl">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </div>
              </div>
            )}

            {/* Footer Area: Platform, Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-navy/80 to-transparent pt-12">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white shadow-sm">
                   <Globe size={12} className="text-brand-orange" />
                   <span className="text-[9px] font-black uppercase tracking-tight">{item.source_platform}</span>
                </div>
                <div className="px-2 py-1 bg-brand-blue/50 backdrop-blur-md rounded-lg border border-white/10">
                   <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">{item.category}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-black text-white leading-tight line-clamp-2 group-hover:text-brand-orange transition-colors drop-shadow-lg">
                {item.title}
              </h3>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="col-span-full py-24 text-center glass-card rounded-[32px] border-white/20">
          <Box size={48} className="mx-auto mb-4 text-brand-blue opacity-20" />
          <p className="text-navy font-black opacity-40 uppercase tracking-widest text-sm">Không có nội dung nào phù hợp</p>
          <button 
            onClick={() => {}} 
            className="mt-6 text-brand-blue font-black text-xs uppercase underline decoration-2 underline-offset-4"
          >
            Xóa Tất Cả Bộ Lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentGrid;
