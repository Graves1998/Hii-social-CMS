import { Filter, Hash, Layers, LayoutGrid, Rows, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ContentTable from '@/features/content/components/content-table';
import { ApproveContentBatchPayload, ContentItem, ContentStatus } from '@/features/content/types';
import {
  ContentGrid,
  ContentGridSkeleton,
  ContentTableSkeleton,
  FilterSkeleton,
} from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared/ui';
import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { FloatingBatchActionBar, RejectConfirmationModal, useContentContext } from '../components';
import Media from '../components/media';
import {
  useApproveContents,
  useApprovingStatus,
  useContent,
  useRejectContents,
} from '../hooks/useContent';
import { ContentSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';
import { useCrawlStore } from '../stores/useCrawlStore';
import { transformStatusLabel } from '../utils';

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

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  const {
    service: _service,
    currentUser: _currentUser,
    refreshData: _refreshData,
  } = useRouteContext({
    strict: false,
  });

  const { data: approvingStatus } = useApprovingStatus();

  const { platforms, categories } = useContentContext();

  const filters: ContentSearchSchema = useSearch({ strict: false });

  const updateFilters = useMemo(() => {
    return (key: keyof ContentSearchSchema, value: any) => {
      navigate({
        to: '/content',
        search: {
          ...filters,
          [key]: value,
        },
      });
    };
  }, [filters, navigate]);

  const setFilters = useCallback(
    (key: keyof ContentSearchSchema, value: any) => updateFilters(key, value),
    [updateFilters]
  );

  const { selectedIds, setSelectedIds } = useContentStore((state) => state);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { setContentDetails } = useCrawlStore();
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);

  // Batch mutations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();

  const debounceFn = useMemo(
    () => debounce((value: string) => setFilters('search', value), 500),
    [setFilters]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debounceFn(value);
  };

  const handleNavigateToDetail = (item: ContentItem) => {
    setContentDetails(item);
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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
      categories: selectedCategories,
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
        selectedIds.includes(item.id) &&
        (item.status === ContentStatus.PENDING_REVIEW || item.status === ContentStatus.APPROVED)
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
        selectedIds.includes(item.id) &&
        (item.status === ContentStatus.PENDING_REVIEW || item.status === ContentStatus.APPROVED)
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

  const toggleCategory = (cat: string) => {
    const isExists = filters.tags.includes(cat);
    if (isExists) {
      setFilters(
        'tags',
        filters.tags.filter((c: string) => c !== cat)
      );
    } else {
      setFilters('tags', [...filters.tags, cat]);
    }
  };

  const statusTabs = useMemo(() => {
    const tabs = approvingStatus
      ?.filter((tab) => tab.slug !== 'draft')
      .map((tab) => ({
        slug: tab.slug,
        name: transformStatusLabel(tab.slug),
        icon: Layers,
      }));
    tabs?.unshift({ slug: '', name: transformStatusLabel(ContentStatus.ALL), icon: Layers });
    return tabs;
  }, [approvingStatus]);

  // Count items eligible for approve (PENDING_REVIEW only)
  const batchApproveCount = items?.filter((i: ContentItem) => selectedIds.includes(i.id)).length;

  // Count items eligible for reject (PENDING_REVIEW or APPROVED)
  const batchRejectCount = items?.filter((i: ContentItem) => selectedIds.includes(i.id)).length;

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
        {isLoading ? (
          <FilterSkeleton count={6} label="Lọc Trạng Thái" />
        ) : (
          <div className="space-y-3">
            <Typography variant="tiny" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={10} /> Lọc Trạng Thái
            </Typography>
            <div className="flex flex-wrap gap-1">
              {statusTabs?.map((tab) => (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setFilters('approving_status', tab.slug)}
                  className={`flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase transition-all ${
                    filters.approving_status === tab.slug
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        {isLoading ? (
          <FilterSkeleton count={5} label="Lọc Danh Mục" />
        ) : (
          <div className="space-y-3">
            <Typography variant="tiny" className="flex items-center gap-2 font-mono text-zinc-500">
              <Hash size={10} /> Lọc Danh Mục
            </Typography>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFilters('tags', [])}
                className={`border px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                  filters.tags.length === 0
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                TẤT CẢ
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`border px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                    filters.tags.includes(cat.id)
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row">
          <div className="flex-1">
            <div className="group relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              <Input
                placeholder="TÌM_KIẾM_CƠ_SỞ_DỮ_LIỆU..."
                className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white uppercase focus:border-white"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filters.platform}
              onValueChange={(value) => setFilters('platform', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả nền tảng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked value="all">
                  Tất cả nền tảng
                </SelectItem>
                {platforms.map((p) => (
                  <SelectItem key={p.id} value={p.api_key}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-white/10 bg-black p-1">
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  viewMode === 'table' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('table')}
              >
                <Rows size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {isLoading && viewMode === 'grid' && <ContentGridSkeleton count={12} />}

      {!isLoading && viewMode === 'table' && (
        <ContentTable
          items={items || []}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={
            filters.approving_status === ContentStatus.PENDING_REVIEW
              ? handleToggleSelect
              : undefined
          }
          onToggleAll={
            filters.approving_status === ContentStatus.PENDING_REVIEW
              ? () => handleSelectAll(items || [])
              : undefined
          }
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
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
            const isPending = item.status === ContentStatus.PENDING_REVIEW;
            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={isPending ? handleToggleSelect : undefined}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

      {/* Floating Batch Action Bar */}
      <FloatingBatchActionBar
        selectedCount={selectedIds.length}
        approveCount={batchApproveCount}
        rejectCount={batchRejectCount}
        isApproving={isApprovingBatch}
        isRejecting={isRejectingBatch}
        onApprove={handleBatchApprove}
        onReject={handleBatchReject}
        onCancel={() => {
          setSelectedIds([]);
          setSelectedCategories([]);
        }}
        categories={categories.map((cat) => cat.name)}
        showCategorySelector
        onCategoriesChange={(cats: string[]) => setSelectedCategories(cats)}
        selectedCategories={selectedCategories}
      />

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />
    </div>
  );
}

export default ContentPageComponent;
