import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Hash,
  Layers,
  LayoutGrid,
  Rows,
  Search,
  ShieldAlert,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useNavigate, useSearch, useRouteContext } from '@tanstack/react-router';
import ContentTable from '@/features/content/components/content-table';
import { ContentItem, ContentStatus, SourcePlatform } from '@/features/content/types';
import { ContentGrid } from '@/shared/components';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import Media from '../components/media';

function ContentPageComponent() {
  const navigate = useNavigate();

  const { status, source } = useSearch({ strict: false }) as { status?: string; source?: string };
  const { items, categories, service, currentUser, refreshData } = useRouteContext({
    strict: false,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(status || 'ALL');
  const [sourceFilter] = useState<string>(source || 'ALL');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

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

  const toggleCategory = (cat: string) => {
    setCategoryFilters((prev) =>
      prev.includes(cat) ? prev.filter((c: string) => c !== cat) : [...prev, cat]
    );
  };

  const filteredContent = useMemo(() => {
    return items.filter((item: ContentItem) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.content_id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (sourceFilter !== 'ALL') {
        if (item.source_type !== sourceFilter && item.source_platform !== sourceFilter)
          return false;
      }
      if (platformFilter !== 'ALL') {
        if (
          item.source_platform !== platformFilter &&
          !item.target_platforms?.includes(platformFilter as SourcePlatform)
        ) {
          return false;
        }
      }
      if (categoryFilters.length > 0 && !categoryFilters.includes(item.category)) {
        return false;
      }
      return true;
    });
  }, [items, searchQuery, statusFilter, sourceFilter, platformFilter, categoryFilters]);

  const statusTabs = [
    { id: 'ALL', label: 'Tất cả', icon: Layers },
    { id: ContentStatus.DRAFT, label: 'Nháp', icon: Zap },
    { id: ContentStatus.PENDING_REVIEW, label: 'Chờ duyệt', icon: Clock },
    { id: ContentStatus.APPROVED, label: 'Đã duyệt', icon: ThumbsUp },
    { id: ContentStatus.SCHEDULED, label: 'Đã lên lịch', icon: Calendar },
    { id: ContentStatus.PUBLISHED, label: 'Đã đăng', icon: CheckCircle2 },
    { id: ContentStatus.REJECTED, label: 'Từ chối', icon: ShieldAlert },
  ];

  const platformTabs = [
    { id: 'ALL', label: 'Tất cả nền tảng' },
    { id: SourcePlatform.YAAH_CONNECT, label: 'Yaah Connect' },
    { id: SourcePlatform.LALALA, label: 'Lalala' },
    { id: SourcePlatform.VOTEME, label: 'Voteme' },
  ];

  const batchActionableCount = items.filter(
    (i: ContentItem) =>
      selectedIds.includes(i.content_id) && i.status === ContentStatus.PENDING_REVIEW
  ).length;

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
            <Filter size={10} /> Lọc Trạng Thái
          </label>
          <div className="flex flex-wrap gap-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase transition-all ${
                  statusFilter === tab.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
            <Hash size={10} /> Lọc Danh Mục
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCategoryFilters([])}
              className={`border px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                categoryFilters.length === 0
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              TẤT CẢ
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`border px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                  categoryFilters.includes(cat)
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={platformFilter} onValueChange={(value) => setPlatformFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả nền tảng" />
              </SelectTrigger>

              <SelectContent>
                {platformTabs.map((p) => (
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
          items={filteredContent}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={() => handleSelectAll(filteredContent)}
        />
      ) : (
        <ContentGrid isEmpty={filteredContent.length === 0}>
          {filteredContent.map((item: ContentItem) => {
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

export default ContentPageComponent;
