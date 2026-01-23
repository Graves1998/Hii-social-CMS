function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col font-mono">
      <span className="mb-1 text-[10px] text-zinc-500 uppercase">{label}</span>
      <span className="text-xl font-medium text-white">{value}</span>
    </div>
  );
}

export default StatItem;
