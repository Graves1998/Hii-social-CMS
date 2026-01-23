import { useState } from 'react';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import ContentTable from '@/features/content/components/content-table';
import { ContentItem } from '@/shared/types';

function AuditPageComponent() {
  const navigate = useNavigate();
  const { items } = useRouteContext({ strict: false });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  return (
    <div className="animate-in fade-in">
      <ContentTable
        items={items}
        onView={handleNavigateToDetail}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleAll={() => handleSelectAll(items)}
      />
    </div>
  );
}

export default AuditPageComponent;
