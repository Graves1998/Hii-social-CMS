import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams, useRouteContext } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DetailPageSkeleton } from '@/shared/components';
import {
  ActivityLogModal,
  Queue,
  RejectConfirmationModal,
  useContentContext,
  WorkflowSteps,
} from '../components';
import { useCreateContent } from '../hooks/useContent';
import {
  useCrawlContent,
  useGetContentCrawlerDetails,
  useMakeVideoCrawler,
} from '../hooks/useCrawlContent';
import { ContentSchema } from '../schemas/content.schema';
import { useCrawlStore } from '../stores/useCrawlStore';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const {
    data: crawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCrawlContent,
  } = useCrawlContent();

  // Infinite scroll for queue
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 200,
  });

  const { mutate: createContent } = useCreateContent();
  const { mutateAsync: makeVideoCrawler } = useMakeVideoCrawler();
  const { selectedIds, setSelectedIds } = useCrawlStore();

  const navigate = useNavigate();
  const { service, currentUser } = useRouteContext({
    strict: false,
  });

  const { platforms, categories } = useContentContext();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const { data: contentDetails, isLoading: isLoadingContentDetails } = useGetContentCrawlerDetails(
    Number(contentId)
  );

  const allTags = [...(contentDetails?.tags || []), ...categories.map((c) => c.slug)];
  const { register, handleSubmit, setValue, watch } = useForm<ContentSchema>({
    values: contentDetails
      ? {
          title: contentDetails?.title || '',
          description: contentDetails?.short_description || '',
          is_allow_comment: true,
          tags: contentDetails?.tags || undefined,
          media: [contentDetails?.media_url || ''],
          thumbnail: contentDetails?.thumbnail_url || '',
          platforms: platforms?.map((p) => p.api_key) || [],
          status: ContentStatus.PRIVATE,
        }
      : undefined,
  });

  const watchPlatforms = watch('platforms');
  const watchTags = watch('tags');

  const handleUpdateMetadata = (key: 'platforms' | 'tags', value: string) => {
    const isExist = watch(key).includes(value);
    if (isExist) {
      setValue(
        key,
        watch(key).filter((p) => p !== value)
      );
    } else {
      setValue(key, [...watch(key), value]);
    }
  };

  const onSubmit = (data: ContentSchema) => {
    const toastId = toast.loading(`Publishing content...`);
    createContent(
      {
        data,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Publish content successfully');
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Publish content failed');
        },
      }
    );
  };

  const handleUpdateStatus = (_id: string, _nextStatus: ContentStatus) => {
    if (!contentDetails) {
      // TODO: Implement status update
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (pendingRejectId) {
      service.updateContent(
        pendingRejectId,
        {
          status: ContentStatus.REJECTED,
          moderation_notes: reason,
        },
        currentUser.name
      );
    }
    setIsRejectModalOpen(false);
    setPendingRejectId(null);
  };

  const handleToggleSelect = (id: string) => {
    const isExists = selectedIds.includes(id);
    if (isExists) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = crawlContent.filter((item) => selectedIds.includes(item.id));

    if (eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Vui lòng chọn ít nhất một nội dung để duyệt',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} video...`);

    const promises = eligibleApprovals.map((item) =>
      makeVideoCrawler({
        payload: {
          is_previewed: true,
          message: 'Approved by admin',
          video_id: Number(item.id),
        },
        video_id: Number(item.id),
      })
    );

    Promise.all(promises)
      .then(() => {
        toast.dismiss(toastId);
        toast.success('DUYỆT THÀNH CÔNG', {
          description: `Đã duyệt ${eligibleApprovals.length} video`,
        });
        setSelectedIds([]);
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error('DUYỆT THẤT BẠI', {
          description: 'Không thể duyệt video. Vui lòng thử lại.',
        });
      });
  };

  const handleBatchReject = () => {
    const eligibleRejections = crawlContent.filter((item) => selectedIds.includes(item.id));

    if (eligibleRejections.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Vui lòng chọn ít nhất một nội dung để từ chối',
      });
      return;
    }

    // Show confirmation modal
    setIsBatchRejectModalOpen(true);
  };

  const handleConfirmBatchReject = (reason: string) => {
    const eligibleRejections = crawlContent.filter((item) => selectedIds.includes(item.id));

    if (eligibleRejections.length === 0) return;

    const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} video...`);

    const promises = eligibleRejections.map((item) =>
      makeVideoCrawler({
        payload: {
          is_previewed: false,
          message: reason,
          video_id: Number(item.id),
        },
        video_id: Number(item.id),
      })
    );

    Promise.all(promises)
      .then(() => {
        toast.dismiss(toastId);
        toast.success('TỪ CHỐI THÀNH CÔNG', {
          description: `Đã từ chối ${eligibleRejections.length} video`,
        });
        setSelectedIds([]);
        setIsBatchRejectModalOpen(false);
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error('TỪ CHỐI THẤT BẠI', {
          description: 'Không thể từ chối video. Vui lòng thử lại.',
        });
      });
  };

  // Count items eligible for approve/reject
  const batchApproveCount = crawlContent.filter((i) => selectedIds.includes(i.id)).length;
  const batchRejectCount = batchApproveCount;

  if (!contentDetails) {
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

  const isEditable =
    contentDetails.status === ContentStatus.DRAFT || currentUser.role === 'ADMIN' || true;

  const workflowSteps = [
    { id: ContentStatus.DRAFT, label: 'K.TẠO' },
    { id: ContentStatus.PENDING_REVIEW, label: 'DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'XONG' },
    { id: ContentStatus.SCHEDULED, label: 'CHỜ' },
    { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === contentDetails.status);
  const isRejected = contentDetails.status === ContentStatus.REJECTED;
  const isArchived = contentDetails.status === ContentStatus.ARCHIVED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;

  if (isLoadingCrawlContent) {
    return <DetailPageSkeleton />;
  }
  if (!crawlContent) {
    return <EmptyDetailPage />;
  }

  return (
    <div className="detail-layout animate-in fade-in duration-300">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        <Queue
          queueItems={crawlContent}
          item={contentDetails}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
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
                {contentDetails.media_type?.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          <video src={contentDetails.media_url} className="video-mock" autoPlay muted loop />
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
      <form onSubmit={handleSubmit(onSubmit)} id="content-form" className="inspector">
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          {isEditable ? (
            <Textarea
              {...register('description')}
              value={watch('description')}
              className="readout h-32 resize-none border border-white/10 bg-transparent p-2 transition-colors focus:border-white"
            />
          ) : (
            <p className="readout border border-transparent p-2">
              &ldquo;{contentDetails.short_description}&rdquo;
            </p>
          )}
        </div>

        {/* DISTRIBUTION NETWORKS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            MẠNG LƯỚI PHÂN PHỐI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {platforms?.map((platform) => (
              <Badge
                key={platform.id}
                variant={watchPlatforms.includes(platform.api_key) ? 'default' : 'outline'}
                onClick={() => handleUpdateMetadata('platforms', platform.api_key)}
                className="cursor-pointer transition-colors"
              >
                <Globe size={10} />
                {platform.api_key}
              </Badge>
            ))}
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            THẺ PHÂN LOẠI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {!allTags.length && <p className="text-muted-foreground">Không có thẻ phân loại</p>}
            {allTags.map((tag: string) => (
              <Badge
                key={tag}
                variant={watchTags?.includes(tag) ? 'default' : 'outline'}
                onClick={() => handleUpdateMetadata('tags', tag)}
                className="cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* WORKFLOW STATUS PROGRESS */}
        <WorkflowSteps
          isRejected={isRejected}
          item={contentDetails}
          workflowSteps={workflowSteps}
          activeIndex={activeIndex}
        />

        {/* ACTIONS */}
        <div className="actions">
          <Button
            variant="destructive"
            onClick={() => handleUpdateStatus(contentDetails.content_id, ContentStatus.REJECTED)}
            disabled={isRejected}
          >
            TỪ CHỐI
          </Button>
          <Button
            type="submit"
            variant="default"
            onClick={() => handleUpdateStatus(contentDetails.content_id, ContentStatus.APPROVED)}
            disabled={
              contentDetails.status === ContentStatus.APPROVED ||
              contentDetails.status === ContentStatus.PUBLISHED ||
              !watchPlatforms?.length
            }
          >
            DUYỆT
          </Button>
        </div>
      </form>

      <ActivityLogModal
        item={contentDetails}
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

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 border border-white/20 bg-zinc-900 p-2 pl-6 shadow-2xl backdrop-blur-md">
          <span className="font-mono text-xs text-white uppercase">
            {selectedIds.length} ĐÃ CHỌN
          </span>
          <div className="h-4 w-[1px] bg-white/20" />

          {/* Approve Button */}
          <Button
            variant="default"
            className="h-8 bg-white text-black hover:bg-zinc-200"
            onClick={handleBatchApprove}
            disabled={batchApproveCount === 0}
          >
            DUYỆT ({batchApproveCount || 0})
          </Button>

          {/* Reject Button */}
          <Button
            variant="destructive"
            className="h-8"
            onClick={handleBatchReject}
            disabled={batchRejectCount === 0}
          >
            TỪ CHỐI ({batchRejectCount || 0})
          </Button>

          {/* Cancel Button */}
          <div className="h-4 w-[1px] bg-white/20" />
          <Button
            variant="ghost"
            className="h-8 text-zinc-400 hover:text-white"
            onClick={() => setSelectedIds([])}
          >
            HỦY
          </Button>
        </div>
      )}
    </div>
  );
}

function EmptyDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center font-mono text-zinc-500 uppercase">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
      <Button variant="link" onClick={() => navigate({ to: '/content/crawl' })}>
        QUAY LẠI DANH SÁCH
      </Button>
    </div>
  );
}

export default DetailPageComponent;
