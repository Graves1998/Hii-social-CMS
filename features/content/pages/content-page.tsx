import { Filter, Hash, Layers, LayoutGrid, Rows, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import ContentTable from '@/features/content/components/content-table';
import { ContentItem, ContentStatus } from '@/features/content/types';
import { ContentGrid } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared/ui';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { useContentContext } from '../components';
import Media from '../components/media';
import { useApprovingStatus, useContent } from '../hooks/useContent';
import { useContentStore } from '../stores/useContentStore';
import { useCrawlStore } from '../stores/useCrawlStore';
import { transformStatusLabel } from '../utils';

function ContentPageComponent() {
  const navigate = useNavigate();

  const {
    data: items,
    isLoading,
    error,
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

  const { service, currentUser, refreshData } = useRouteContext({
    strict: false,
  });

  const { data: approvingStatus } = useApprovingStatus();

  const { platforms, categories } = useContentContext();

  const { filters, setFilters } = useContentStore();

  const { selectedIds, setSelectedIds } = useContentStore((state) => state);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { setContentDetails } = useCrawlStore();

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
      search: { approving_status: item.status },
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
    const visibleIds = visibleItems.map((i) => i.id);
    if (visibleIds.every((id) => selectedIds.includes(id.toString()))) {
      setSelectedIds(selectedIds.filter((id) => !visibleIds.includes(id.toString())));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection).map((id) => id.toString()));
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id.toString()) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (eligibleApprovals?.length === 0) return;

    eligibleApprovals?.forEach((item: ContentItem) => {
      service.updateContent(item.id, { status: ContentStatus.APPROVED }, currentUser.name);
    });

    refreshData();
    setSelectedIds([]);
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

  const batchActionableCount = items?.filter(
    (i: ContentItem) => selectedIds.includes(i.id.toString()) && i.status === ContentStatus.ALL
  ).length;

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
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

        {/* Category Filter */}
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

      {viewMode === 'table' ? (
        <ContentTable
          items={items || []}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={() => handleSelectAll(items || [])}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : (
        <ContentGrid
          isEmpty={items?.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          {items?.map((item: ContentItem) => {
            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-4 border border-white/20 bg-zinc-900 p-2 pl-6 shadow-2xl">
          <span className="font-mono text-xs text-white uppercase">
            {selectedIds.length} ĐÃ CHỌN
          </span>
          <div className="h-4 w-[1px] bg-white/20" />
          <Button
            variant="default"
            className="h-8 bg-white text-black hover:bg-zinc-200"
            onClick={handleBatchApprove}
            disabled={batchActionableCount === 0}
          >
            DUYỆT HÀNG LOẠT ({batchActionableCount})
          </Button>
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

export default ContentPageComponent;
