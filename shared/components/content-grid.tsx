import React from 'react';

interface ContentGridProps {
  children: React.ReactNode;
  isEmpty: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({ children, isEmpty }) => {
  return (
    <div className="grid grid-cols-1 gap-[2px] border border-white/10 bg-white/10 p-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
      {isEmpty && <EmptyState />}
    </div>
  );
};

function EmptyState() {
  return (
    <div className="col-span-full bg-black py-20 text-center">
      <p className="font-mono text-sm text-zinc-500 uppercase">KHÔNG TÌM THẤY TÍN HIỆU</p>
    </div>
  );
}

export default ContentGrid;
