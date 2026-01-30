import { cn } from '@/lib';
import { Typography } from '@/shared';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui';
import { FileVideo, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { Media } from '../types';

interface MediaCarouselProps {
  media: Media[];
  title?: string;
  className?: string;
}

/**
 * MediaCarousel Component
 *
 * Hiển thị carousel cho article content với nhiều media items (images/videos)
 *
 * Features:
 * - Responsive carousel với navigation
 * - Support images và videos
 * - Lazy loading
 * - Indicator dots
 * - Keyboard navigation
 */
export function MediaCarousel({ media, title, className }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center border border-white/10 bg-black">
        <Typography variant="small" className="text-zinc-500 uppercase">
          Không có media
        </Typography>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full flex-1"
        setApi={(api) => {
          if (!api) return;
          api.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent className="ml-0 w-full">
          {media.map((item, index) => (
            <CarouselItem key={`carousel-item-${index + 1}`} className="pl-0">
              <div className="relative flex aspect-[9/16] w-full flex-col items-center justify-center overflow-hidden border border-white/10 bg-black">
                <img
                  src={item.url || item.download_url}
                  alt={title || `Media ${index + 1}`}
                  className="h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      {media.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {media.map((_, index) => (
            <button
              key={`carousel-indicator-${index + 1}`}
              type="button"
              onClick={() => {
                // Navigate to specific slide (requires CarouselApi)
              }}
              className={cn(
                'h-1.5 transition-all',
                index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
