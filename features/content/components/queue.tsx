import { cn } from '@/lib';
import { ContentItem, ContentStatus, STATUS_LABELS, Typography } from '@/shared';
import { useNavigate } from '@tanstack/react-router';
import { ListVideo } from 'lucide-react';
import { useCrawlStore } from '../stores/useCrawlStore';

type QueueListProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

function QueueList({
  queueItems,
  item,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
}: QueueListProps) {
  return (
    <div className="custom-scrollbar flex flex-col overflow-y-auto">
      {queueItems.map((qItem) => (
        <QueueItem
          key={qItem.content_id}
          qItem={qItem}
          activeItem={qItem.content_id === item.content_id}
        />
      ))}

      {/* Infinite Scroll Trigger */}
      {loadMoreRef && (
        <div ref={loadMoreRef} className="flex justify-center p-4">
          {isFetchingNextPage && <LoadingState />}
          {!isFetchingNextPage && hasNextPage && (
            <div className="font-mono text-[10px] text-zinc-600 uppercase">SCROLL_FOR_MORE</div>
          )}
        </div>
      )}
    </div>
  );
}

function QueueItem({ qItem, activeItem }: { qItem: ContentItem; activeItem: boolean }) {
  const navigate = useNavigate();
  const { setContentDetails } = useCrawlStore();

  const handleClick = () => {
    setContentDetails(qItem);
    navigate({
      to: `${qItem.details_link}/$contentId`,
      params: { contentId: qItem.id },
      search: { approving_status: qItem.status },
    });
  };
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'relative flex cursor-pointer items-center gap-3 p-4 transition-all duration-300',
        activeItem &&
          'after:bg-accent bg-foreground/5 after:absolute after:top-0 after:bottom-0 after:left-0 after:w-0.5 after:shadow-md'
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <img
        src={qItem.thumbnail_url}
        className="border-border h-16 w-12 shrink-0 border object-cover"
        alt="thumb"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2">
        <Typography className="line-clamp-1 font-bold text-white" variant="small">
          {qItem.title}
        </Typography>
        <Typography className="text-muted-foreground line-clamp-2 font-mono" variant="tiny">
          {qItem.short_description}
        </Typography>
        <Typography className="text-muted-foreground" variant="tiny">
          {qItem.category}
        </Typography>
      </div>
    </div>
  );
}

type QueueProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

function Queue({ queueItems, item, loadMoreRef, hasNextPage, isFetchingNextPage }: QueueProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Typography className="flex items-center gap-2 p-4 font-medium" variant="tiny">
        <ListVideo size={12} />
        <span>HÀNG ĐỢI // {STATUS_LABELS[item.status as ContentStatus]}</span>
        <span className="ml-auto opacity-50">{queueItems.length}</span>
      </Typography>
      <QueueList
        queueItems={queueItems}
        item={item}
        loadMoreRef={loadMoreRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-white uppercase">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      <span>LOADING...</span>
    </div>
  );
}

export { QueueItem, QueueList };
export default Queue;
