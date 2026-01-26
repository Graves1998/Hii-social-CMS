import { Badge, Typography } from '@/shared';
import { ContentItem, MediaType } from '@/shared/types';
import { Check, Play } from 'lucide-react';

interface MediaProps {
  item: ContentItem;
  onView: () => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

function Media({ item, onView, isSelected, onToggleSelect }: MediaProps) {
  const isVideo = item.media_type === MediaType.VIDEO;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(item.id);
  };

  return (
    <button
      type="button"
      onClick={() => onView()}
      className="group hover:bg-background relative cursor-pointer overflow-hidden bg-black p-6 text-left transition-colors"
    >
      {/* Hover Line */}
      <div className="absolute top-0 left-0 z-20 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      {/* Selection Checkbox */}
      {onToggleSelect && (
        <button
          type="button"
          onClick={handleCheckboxClick}
          className="absolute top-3 right-3 z-30 flex h-6 w-6 cursor-pointer items-center justify-center border border-white/20 bg-black/80 backdrop-blur transition-all hover:border-white"
        >
          {isSelected && <Check size={14} className="text-white" />}
        </button>
      )}

      {/* Meta */}
      <div className="mb-6 flex flex-wrap items-center gap-1 font-mono text-[10px] text-zinc-500">
        {item.tags?.map((tag) => (
          <Badge variant="outline" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* Image/Media */}
      <div className="relative mb-6 aspect-[16/10] overflow-hidden border border-white/5 bg-[#111] transition-colors duration-500 group-hover:border-zinc-600">
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="h-full w-full object-cover opacity-70 filter transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="group-hover:bg-background flex h-8 w-8 items-center justify-center rounded-none border border-white/20 bg-black/50 backdrop-blur transition-all">
              <Play size={12} className="fill-white text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <Typography
          variant="h4"
          className="line-clamp-2 text-white transition-colors group-hover:text-white"
        >
          {item.title}
        </Typography>
        <Typography variant="small" className="line-clamp-2 font-mono text-zinc-500">
          {item.short_description}
        </Typography>
      </div>

      {/* Bottom Actions */}
    </button>
  );
}

export default Media;
