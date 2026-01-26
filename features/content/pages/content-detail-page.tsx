import { useInfiniteScroll } from '@/shared/hooks';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Typography } from '@/shared/ui';
import { useNavigate, useParams, useRouteContext, useSearch } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ActivityLogModal,
  Queue,
  RejectConfirmationModal,
  ScheduleModal,
  WorkflowSteps,
} from '../components';
import {
  useApproveContent,
  useContent,
  useContentDetails,
  useRejectContent,
} from '../hooks/useContent';
import { useScheduleContent } from '../hooks/useSchedule';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const searchParams = useSearch({ strict: false });

  const {
    data: realContent,
    isLoading: isLoadingCrawlContent,
    error: errorCrawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContent(searchParams?.approving_status as ContentStatus);

  const { mutate: approveContent, isPending: isApproveContentPending } = useApproveContent();
  const { mutate: rejectContent, isPending: isRejectContentPending } = useRejectContent();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 200,
  });

  const { data: item } = useContentDetails({
    id: contentId,
    approving_status: searchParams?.approving_status as string,
  });
  const navigate = useNavigate();
  const { service, currentUser } = useRouteContext({ strict: false });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const scheduleContentMutation = useScheduleContent();

  const approveContentHandler = () => {
    if (!item) return;
    const toastId = toast.loading(`Duyệt nội dung ${item.id}...`);

    approveContent(
      {
        reel_id: item.id,
        reason: 'Ok',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Duyệt nội dung thành công');
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Duyệt nội dung thất bại');
        },
      }
    );
  };

  const handleUpdateStatus = (nextStatus: ContentStatus) => {
    if (!item) return;
    switch (nextStatus) {
      case ContentStatus.REJECTED:
        setIsRejectModalOpen(true);
        break;
      case ContentStatus.APPROVED:
        approveContentHandler();
        break;
      default:
        break;
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (item) {
      rejectContent(
        {
          reel_id: item.id,
          reason,
        },
        {
          onSuccess: () => {
            toast.success('Từ chối nội dung thành công');
            setIsRejectModalOpen(false);
            setPendingRejectId(null);
          },
          onError: () => {
            toast.error('Từ chối nội dung thất bại');
          },
        }
      );
    }
  };

  const handleScheduleConfirm = (scheduledTime: string) => {
    if (!item) return;

    const toastId = toast.loading('ĐANG_LÊN_LỊCH...');

    scheduleContentMutation.mutate(
      {
        contentId: item.content_id,
        scheduledTime,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('LÊN_LỊCH_THÀNH_CÔNG', {
            description: `Video sẽ được đăng vào ${new Date(scheduledTime).toLocaleString('vi-VN')}`,
            duration: 4000,
          });
          setIsScheduleModalOpen(false);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('LÊN_LỊCH_THẤT_BẠI', {
            description: 'Không thể lên lịch. Vui lòng thử lại.',
            duration: 4000,
          });
        },
      }
    );
  };

  if (!item) {
    return (
      <div className="flex h-full flex-col items-center justify-center font-mono text-zinc-500 uppercase">
        <AlertTriangle size={48} className="mb-4 opacity-50" />
        <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
        <Button variant="link" onClick={() => navigate({ to: '/content' })}>
          QUAY LẠI DANH SÁCH
        </Button>
      </div>
    );
  }

  const workflowSteps = [
    { id: ContentStatus.PENDING_REVIEW, label: 'CHỜ DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'DUYỆT' },
    { id: ContentStatus.SCHEDULED, label: 'LÊN LỊCH' },
    { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === item.status);
  const isRejected = item.status === ContentStatus.REJECTED;
  const isArchived = item.status === ContentStatus.ARCHIVED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;

  return (
    <div className="detail-layout animate-in fade-in duration-300">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        <Queue
          queueItems={realContent || []}
          item={item}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
        />
      </aside>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container group">
        <div className="shutter-frame">
          <div className="shutter-blade shutter-top" />
          <div className="shutter-blade shutter-bottom" />

          {/* UI Overlay */}
          <div className="ui-overlay">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />{' '}
                GHI
              </span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="scanline" />
            <div className="text-right">
              <span>
                {item.media_type?.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          <video src={item.media_url} className="video-mock" autoPlay muted loop />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
          onClick={() => navigate({ to: '/content' })}
        >
          <X size={20} />
        </Button>
      </section>

      {/* RIGHT: INSPECTOR SECTION */}
      <aside className="inspector">
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          <p className="readout border border-transparent p-2">
            &ldquo;{item.short_description}&rdquo;
          </p>
        </div>

        {/* DISTRIBUTION NETWORKS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            MẠNG LƯỚI PHÂN PHỐI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">
              <Globe size={10} />
              {item.category}
            </Badge>
          </div>
        </div>

        {/* TAGS */}
        {!!item.tags?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="tiny" className="text-muted-foreground font-medium">
              THẺ PHÂN LOẠI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {item.tags?.map((tag: any) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* WORKFLOW STATUS PROGRESS */}
        <WorkflowSteps
          isRejected={isRejected}
          item={item}
          workflowSteps={workflowSteps}
          activeIndex={activeIndex}
        />

        {/* ACTIONS */}
        <div className="actions">
          <Button
            variant="destructive"
            onClick={() => handleUpdateStatus(ContentStatus.REJECTED)}
            disabled={isRejected}
          >
            TỪ CHỐI
          </Button>
          {item.status !== ContentStatus.PENDING_REVIEW && (
            <Button
              variant="outline"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={item.status === ContentStatus.PUBLISHED}
              className="border-white/20 text-white hover:bg-white/10"
            >
              LÊN LỊCH
            </Button>
          )}
          {item.status === ContentStatus.PENDING_REVIEW && (
            <Button
              variant="default"
              onClick={() => handleUpdateStatus(ContentStatus.APPROVED)}
              disabled={isApproveContentPending}
            >
              DUYỆT
            </Button>
          )}
        </div>
      </aside>

      <ActivityLogModal
        item={item}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        service={service}
      />
      <RejectConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setPendingRejectId(null);
        }}
        onConfirm={handleConfirmReject}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
        item={item}
      />
    </div>
  );
}

export default DetailPageComponent;
