import { Button } from '@/shared/ui';
import { Check, Tag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface FloatingBatchActionBarProps {
  // Selection state
  selectedCount: number;
  approveCount?: number;
  rejectCount?: number;

  // Loading states
  isApproving?: boolean;
  isRejecting?: boolean;

  // Actions
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;

  // Categories (optional)
  categories?: string[];
  onCategoriesChange?: (categories: string[]) => void;

  // Customization
  approveLabel?: string;
  rejectLabel?: string;
  cancelLabel?: string;
  showCategorySelector?: boolean;
  selectedCategories?: string[];
}

/**
 * Floating Batch Action Bar Component
 *
 * Component dùng cho batch actions (approve, reject) với khả năng chọn categories
 * Style: Carbon Kinetic / Hii Social Theme
 *
 * @example
 * <FloatingBatchActionBar
 *   selectedCount={5}
 *   approveCount={3}
 *   rejectCount={2}
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 *   onCancel={handleCancel}
 *   categories={['Category A', 'Category B']}
 *   showCategorySelector
 * />
 */
export function FloatingBatchActionBar({
  selectedCount,
  approveCount,
  rejectCount,
  isApproving = false,
  isRejecting = false,
  onApprove,
  onReject,
  onCancel,
  categories = [],
  onCategoriesChange,
  approveLabel = 'DUYỆT',
  rejectLabel = 'TỪ CHỐI',
  cancelLabel = 'HỦY',
  showCategorySelector = false,
  selectedCategories: initialSelectedCategories = [],
}: FloatingBatchActionBarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories || []
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      // Notify parent
      if (onCategoriesChange) {
        onCategoriesChange(newCategories);
      }

      return newCategories;
    });
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    if (onCategoriesChange) {
      onCategoriesChange([]);
    }
  };

  useEffect(() => {
    if (initialSelectedCategories) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategories(initialSelectedCategories);
    }
  }, [initialSelectedCategories]);

  if (selectedCount === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 border border-white/20 bg-zinc-900 p-2 pl-6 shadow-2xl backdrop-blur-md">
      {/* Selected Count */}
      <span className="font-mono text-xs text-white uppercase">{selectedCount} ĐÃ CHỌN</span>

      <div className="h-4 w-[1px] bg-white/20" />

      {/* Category Selector (Optional) */}
      {showCategorySelector && categories.length > 0 && (
        <>
          <div ref={dropdownRef} className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <Tag size={14} />
              <span>
                DANH MỤC {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </span>
            </Button>

            {/* Dropdown Menu */}
            {isCategoryDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-66 border border-white/20 bg-zinc-900 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-3">
                  <span className="font-mono text-xs text-white uppercase">Chọn danh mục</span>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Categories List */}
                <div className="max-h-64 overflow-y-auto">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className="flex w-full items-center justify-between p-3 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        <span>{category}</span>
                        {isSelected && <Check size={14} className="text-green-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                {selectedCategories.length > 0 && (
                  <div className="border-t border-white/10 p-2">
                    <button
                      type="button"
                      onClick={handleClearCategories}
                      className="w-full bg-zinc-800 p-2 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                    >
                      XÓA TẤT CẢ
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-white/20" />
        </>
      )}

      {/* Approve Button */}
      {approveCount !== undefined && (
        <Button
          variant="default"
          onClick={onApprove}
          disabled={approveCount === 0 || isApproving || selectedCategories.length === 0}
        >
          {isApproving ? `ĐANG ${approveLabel}...` : `${approveLabel} (${approveCount || 0})`}
        </Button>
      )}

      {/* Reject Button */}
      {rejectCount !== undefined && (
        <Button
          variant="destructive"
          onClick={onReject}
          disabled={rejectCount === 0 || isRejecting}
        >
          {isRejecting ? `ĐANG ${rejectLabel}...` : `${rejectLabel} (${rejectCount || 0})`}
        </Button>
      )}

      {/* Cancel Button */}
      <div className="h-4 w-[1px] bg-white/20" />
      <Button
        variant="ghost"
        className="text-zinc-400 hover:text-white"
        onClick={() => {
          handleClearCategories();
          onCancel();
        }}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
