import { STATUS_LABELS } from '@/shared';
import { ContentStatus, MediaType } from '@/shared/types';
import { Badge, Button, Textarea, Typography } from '@/shared/ui';
import { AlertTriangle, FileText, Globe, ListVideo, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams, useRouteContext } from '@tanstack/react-router';
import { ActivityLogModal, Queue, RejectConfirmationModal, WorkflowSteps } from '../components';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { items, service, currentUser, refreshData } = useRouteContext({ strict: false });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const item = items.find((i: any) => i.content_id === contentId);

  const handleUpdateStatus = (id: string, nextStatus: ContentStatus) => {
    if (nextStatus === ContentStatus.REJECTED) {
      setPendingRejectId(id);
      setIsRejectModalOpen(true);
    } else {
      service.updateContent(id, { status: nextStatus }, currentUser.name);
      refreshData();
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
      refreshData();
    }
    setIsRejectModalOpen(false);
    setPendingRejectId(null);
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

  const isEditable = item.status === ContentStatus.DRAFT || currentUser.role === 'ADMIN';
  const queueItems = items.filter((i: any) => i.status === item.status);

  const workflowSteps = [
    { id: ContentStatus.DRAFT, label: 'K.TẠO' },
    { id: ContentStatus.PENDING_REVIEW, label: 'DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'XONG' },
    { id: ContentStatus.SCHEDULED, label: 'CHỜ' },
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
        <Queue queueItems={queueItems} item={item} />
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
                {item.media_type.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          {item.media_type === MediaType.VIDEO ? (
            <img
              src={`https://picsum.photos/seed/${item.content_id}/450/800`}
              className="video-mock"
              alt="Preview"
            />
          ) : (
            <div className="video-mock flex items-center justify-center bg-zinc-900">
              <FileText size={64} className="text-zinc-600" />
            </div>
          )}
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
          {isEditable ? (
            <Textarea
              value={item.short_description}
              onChange={(e) => {
                service.updateContent(
                  item.content_id,
                  { short_description: e.target.value },
                  currentUser.name
                );
                refreshData();
              }}
              className="readout h-32 resize-none border border-white/10 bg-transparent p-2 transition-colors focus:border-white"
            />
          ) : (
            <p className="readout border border-transparent p-2">
              &ldquo;{item.short_description}&rdquo;
            </p>
          )}
        </div>

        {/* DISTRIBUTION NETWORKS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            MẠNG LƯỚI PHÂN PHỐI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {item.target_platforms?.map((platform: any) => (
              <Badge key={platform} variant="outline">
                <Globe size={10} />
                {platform}
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
            <Badge variant="outline">#{item.category}</Badge>
            {item.tags.map((tag: any) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

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
            onClick={() => handleUpdateStatus(item.content_id, ContentStatus.REJECTED)}
            disabled={isRejected}
          >
            TỪ CHỐI
          </Button>
          <Button
            variant="default"
            onClick={() => handleUpdateStatus(item.content_id, ContentStatus.APPROVED)}
            disabled={
              item.status === ContentStatus.APPROVED || item.status === ContentStatus.PUBLISHED
            }
          >
            DUYỆT
          </Button>
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
    </div>
  );
}

export default DetailPageComponent;
