import { useEffect, useState } from 'react';

import ContentTable from '@/features/content/components/content-table';
import { ApproveContentBatchPayload, ContentItem, ContentStatus } from '@/features/content/types';
import { useAddVideoToPlaylist, useCreatePlaylist } from '@/features/playlist/hooks/usePlaylist';
import { ContentGrid, ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';
import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import {
  AddToPlaylistModal,
  ContentHeader,
  FloatingBatchActionBar,
  RejectConfirmationModal,
} from '../components';
import Media from '../components/media';
import { useApproveContents, useContent, useRejectContents } from '../hooks/useContent';
import { ContentSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';

function ContentPageComponent() {
  const navigate = useNavigate();

  const {
    data: items,
    isLoading,
    error: _error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useContent();

  const {
    service: _service,
    currentUser: _currentUser,
    refreshData: _refreshData,
  } = useRouteContext({
    strict: false,
  });

  const filters: ContentSearchSchema = useSearch({ strict: false });

  const { selectedIds, setSelectedIds, viewMode } = useContentStore((state) => state);

  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

  // Infinite scroll for Grid view
  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  // Batch mutations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
  const { mutate: addVideoToPlaylist } = useAddVideoToPlaylist();
  const { mutate: createPlaylist } = useCreatePlaylist();

  const handleNavigateToDetail = (item: ContentItem) => {
    navigate({
      to: `${item.details_link}/$contentId`,
      params: { contentId: item.id },
      search: { approving_status: item.approving_status },
    });
  };

  const handleToggleSelect = (id: string) => {
    const isExists = selectedIds.includes(id);
    if (isExists) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    // Only select pending items
    const visibleIds = visibleItems.map((i) => i.id);

    if (visibleIds.every((id) => selectedIds.includes(id.toString()))) {
      setSelectedIds(selectedIds.filter((id) => !visibleIds.includes(id.toString())));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection).map((id) => id.toString()));
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = items?.filter((item: ContentItem) => selectedIds.includes(item.id));

    if (!eligibleApprovals || eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} nội dung...`);

    const reelIds = eligibleApprovals.map((item) => ({
      reel_id: item.id,
    }));

    approveContents(
      {
        reel_ids: reelIds as ApproveContentBatchPayload['reel_ids'],
        reason: 'Approved by admin',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('DUYỆT THÀNH CÔNG', {
            description: `Đã duyệt ${eligibleApprovals.length} nội dung`,
          });
          setSelectedIds([]);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('DUYỆT THẤT BẠI', {
            description: 'Không thể duyệt nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  const handleBatchReject = () => {
    const eligibleRejections = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (!eligibleRejections || eligibleRejections.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể từ chối nội dung ở trạng thái CHỜ DUYỆT hoặc ĐÃ DUYỆT',
      });
      return;
    }

    // Show confirmation modal
    setIsBatchRejectModalOpen(true);
  };

  const handleConfirmBatchReject = (reason: string) => {
    const eligibleRejections = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (!eligibleRejections || eligibleRejections.length === 0) return;

    const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} nội dung...`);

    rejectContents(
      {
        reel_ids: eligibleRejections.map((item) => item.id),
        reason,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('TỪ CHỐI THÀNH CÔNG', {
            description: `Đã từ chối ${eligibleRejections.length} nội dung`,
          });
          setSelectedIds([]);
          setIsBatchRejectModalOpen(false);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('TỪ CHỐI THẤT BẠI', {
            description: 'Không thể từ chối nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  // Count items eligible for approve (PENDING_REVIEW)
  const batchApproveCount = items?.filter(
    (i: ContentItem) => selectedIds.includes(i.id) && i.status === ContentStatus.PENDING_REVIEW
  ).length;

  // Count items eligible for reject (PENDING_REVIEW)
  const batchRejectCount = items?.filter(
    (i: ContentItem) => selectedIds.includes(i.id) && i.status === ContentStatus.PENDING_REVIEW
  ).length;

  // Add to Playlist handlers
  const handleOpenAddToPlaylist = () => {
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 video');
      return;
    }

    // Check if all selected videos are published
    const selectedItems = items?.filter((item) => selectedIds.includes(item.id)) || [];
    const hasNonPublished = selectedItems.some(
      (item) => item.approving_status !== ContentStatus.PUBLISHED
    );

    if (hasNonPublished) {
      toast.error('Chỉ có thể thêm video đã đăng vào playlist');
      return;
    }

    setIsAddToPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    // Add each selected video to the playlist
    let successCount = 0;
    const totalCount = selectedIds.length;

    selectedIds.forEach((videoId, index) => {
      addVideoToPlaylist(
        {
          playlistId,
          payload: { video_id: videoId },
        },
        {
          onSuccess: () => {
            successCount += 1;
            // Show toast only after last video
            if (index === totalCount - 1) {
              toast.success(`Đã thêm ${successCount} video vào playlist`);
              setSelectedIds([]);
            }
          },
          onError: () => {
            // Show toast only after last video
            if (index === totalCount - 1) {
              if (successCount > 0) {
                toast.warning(`Đã thêm ${successCount}/${totalCount} video vào playlist`);
              } else {
                toast.error('Thêm video thất bại');
              }
              setSelectedIds([]);
            }
          },
        }
      );
    });
  };

  const handleCreatePlaylistWithVideos = (name: string, description: string) => {
    createPlaylist(
      {
        name,
        description: description || undefined,
        video_ids: selectedIds,
      },
      {
        onSuccess: () => {
          setSelectedIds([]);
        },
      }
    );
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return () => {
      setSelectedIds([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full flex-col space-y-8">
      <ContentHeader />
      {isLoading && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {isLoading && viewMode === 'grid' && <ContentGridSkeleton count={12} />}

      {!isLoading && viewMode === 'table' && (
        <ContentTable
          items={items || []}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={
            filters.approving_status === ContentStatus.PENDING_REVIEW ||
            filters.approving_status === ContentStatus.PUBLISHED
              ? handleToggleSelect
              : undefined
          }
          onToggleAll={
            filters.approving_status === ContentStatus.PENDING_REVIEW ||
            filters.approving_status === ContentStatus.PUBLISHED
              ? () => handleSelectAll(items || [])
              : undefined
          }
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
        />
      )}

      {!isLoading && viewMode === 'grid' && (
        <ContentGrid
          isEmpty={items?.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          {items?.map((item: ContentItem) => {
            const canSelect = item.approving_status === filters.approving_status;

            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={canSelect ? handleToggleSelect : undefined}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <FloatingBatchActionBar
          selectedCount={selectedIds.length}
          approveCount={
            filters.approving_status === ContentStatus.PENDING_REVIEW
              ? batchApproveCount
              : undefined
          }
          rejectCount={
            filters.approving_status === ContentStatus.PENDING_REVIEW ? batchRejectCount : undefined
          }
          isApproving={isApprovingBatch}
          isRejecting={isRejectingBatch}
          onApprove={handleBatchApprove}
          onReject={handleBatchReject}
          onCancel={() => {
            setSelectedIds([]);
          }}
          // Add to Playlist action (only for PUBLISHED status)
          onAddToPlaylist={
            filters.approving_status === ContentStatus.PUBLISHED
              ? handleOpenAddToPlaylist
              : undefined
          }
        />
      )}

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        onAddToPlaylist={handleAddToPlaylist}
        onCreatePlaylist={handleCreatePlaylistWithVideos}
        selectedCount={selectedIds.length}
      />
    </div>
  );
}

export default ContentPageComponent;
