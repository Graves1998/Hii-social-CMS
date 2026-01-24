import { LayoutGrid, Rows, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import Media from '@/features/content/components/media';
import {
  ContentItem,
  ContentStatus,
  MediaType,
  SourcePlatform,
  SourceType,
} from '@/features/content/types';
import ContentGrid from '@/shared/components/content-grid';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { ContentTable } from '../components';
import { useCrawlContent } from '../hooks/useCrawlContent';
import { useCrawlStore } from '../stores/useCrawlStore';

function ContentCrawlPageComponent() {
  const navigate = useNavigate();

  const { items, categories, service, currentUser, refreshData } = useRouteContext({
    strict: false,
  });
  const {
    data: crawlContent,
    isLoading: isLoadingCrawlContent,
    error: errorCrawlContent,
  } = useCrawlContent();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigateToDetail = (id: string) => {
    navigate({ to: '/detail/$contentId', params: { contentId: id } });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    const visibleIds = visibleItems.map((i) => i.content_id);
    if (visibleIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection));
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = items.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.content_id) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (eligibleApprovals.length === 0) return;

    eligibleApprovals.forEach((item: ContentItem) => {
      service.updateContent(item.content_id, { status: ContentStatus.APPROVED }, currentUser.name);
    });

    refreshData();
    setSelectedIds([]);
  };

  const { filters, setFilters } = useCrawlStore();

  const sortOrderOptions = [
    { id: 'asc', label: 'Mới nhất' },
    { id: 'desc', label: 'Cũ nhất' },
  ];
  const batchActionableCount = items.filter(
    (i: ContentItem) =>
      selectedIds.includes(i.content_id) && i.status === ContentStatus.PENDING_REVIEW
  ).length;

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="group relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              <Input
                placeholder="TÌM_KIẾM_CƠ_SỞ_DỮ_LIỆU..."
                className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white uppercase focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filters.sort_order}
              onValueChange={(value) => setFilters('sort_order', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>

              <SelectContent>
                {sortOrderOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-white/10 bg-black p-1">
              <button
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </button>
              <button
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
          items={crawlContent}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={() => handleSelectAll(crawlContent)}
        />
      ) : (
        <ContentGrid isEmpty={crawlContent.length === 0}>
          {crawlContent.map((item) => {
            return <Media item={item} onView={handleNavigateToDetail} key={item.content_id} />;
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

export default ContentCrawlPageComponent;
