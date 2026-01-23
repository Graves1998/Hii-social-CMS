import { cn } from '@/lib';
import { ContentStatus, STATUS_LABELS, Typography } from '@/shared';
import { useNavigate } from '@tanstack/react-router';
import { ListVideo } from 'lucide-react';

function QueueList({ queueItems, item }: { queueItems: any[]; item: any }) {
  return (
    <div className="custom-scrollbar flex flex-col overflow-y-auto">
      {queueItems.map((qItem: any) => (
        <QueueItem
          key={qItem.content_id}
          qItem={qItem}
          activeItem={qItem.content_id === item.content_id}
        />
      ))}
    </div>
  );
}

function QueueItem({ qItem, activeItem }: { qItem: any; activeItem: boolean }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: '/detail/$contentId',
      params: { contentId: qItem.content_id },
    });
  };
  return (
    <div
      className={cn(
        'relative flex cursor-pointer items-center gap-3 p-4 transition-all duration-300',
        activeItem &&
          'after:bg-accent bg-foreground/5 after:absolute after:top-0 after:bottom-0 after:left-0 after:w-0.5 after:shadow-md'
      )}
      onClick={handleClick}
    >
      <img
        src={`https://picsum.photos/seed/${qItem.content_id}/200/300`}
        className="border-border h-16 w-12 shrink-0 border object-cover"
        alt="thumb"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2">
        <Typography className="line-clamp-2 font-bold text-white" variant="small">
          {qItem.title}
        </Typography>
        <Typography className="text-muted-foreground font-mono" variant="tiny">
          {qItem.content_id}
        </Typography>
        <Typography className="text-muted-foreground" variant="tiny">
          {qItem.category}
        </Typography>
      </div>
    </div>
  );
}

function Queue({ queueItems, item }: { queueItems: any[]; item: any }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Typography className="flex items-center gap-2 p-4 font-medium" variant="tiny">
        <ListVideo size={12} />
        <span>HÀNG ĐỢI // {STATUS_LABELS[item.status as ContentStatus]}</span>
        <span className="ml-auto opacity-50">{queueItems.length}</span>
      </Typography>
      <QueueList queueItems={queueItems} item={item} />
    </div>
  );
}

export { QueueItem, QueueList };
export default Queue;
