function Tooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="border border-white/10 bg-black p-2 shadow-none">
        <div className="mb-1 font-mono text-[10px] text-zinc-500 uppercase">{label}</div>
        <div className="font-mono text-sm text-white">{payload[0].value} ĐƠN VỊ</div>
      </div>
    );
  }
  return null;
}

export default Tooltip;
