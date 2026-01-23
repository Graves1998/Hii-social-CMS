function KPICard({
  count,
  subtext,
  onClick,
}: {
  count: number;
  subtext: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden border border-white/10 bg-black p-6 transition-all duration-500 hover:bg-[#111]"
    >
      {/* Hover Top Border Effect */}
      <div className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      <div className="mb-4 flex items-start justify-between font-mono text-[10px] text-zinc-500">
        <span className="uppercase">{subtext}</span>
      </div>

      <h3 className="mb-2 text-3xl font-bold text-white">{count}</h3>
    </div>
  );
}
export default KPICard;
