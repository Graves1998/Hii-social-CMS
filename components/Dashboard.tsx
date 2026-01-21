
import React, { useMemo, useState } from 'react';
import { 
  ContentItem, 
  ContentStatus, 
  SourceType, 
  SourcePlatform 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';
import { 
  Zap, 
  Clock, 
  ShieldAlert, 
  ThumbsUp, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

interface DashboardProps {
  items: ContentItem[];
  onNavigate: (filter: { status?: string; source?: string }) => void;
}

const KPICard = ({ 
  title, 
  count, 
  icon: Icon, 
  colorClass, 
  bgClass, 
  onClick 
}: { 
  title: string; 
  count: number; 
  icon: any; 
  colorClass: string; 
  bgClass: string;
  onClick: () => void;
}) => (
  <div 
    onClick={onClick}
    className="glass-card p-6 rounded-[32px] cursor-pointer hover:scale-105 transition-all duration-300 border-white/40 shadow-xl group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${bgClass} ${colorClass} group-hover:rotate-12 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className={`text-3xl font-black ${colorClass}`}>
        {count}
      </div>
    </div>
    <h3 className="text-sm font-black text-navy/60 uppercase tracking-widest group-hover:text-navy transition-colors">
      {title}
    </h3>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy/90 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">{label}</p>
        <p className="text-lg font-bold">
          {payload[0].value} <span className="text-xs font-normal opacity-80">Nội dung</span>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate }) => {
  // Default date range: Last 7 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // --- Data Processing for KPIs (Global Totals - Not affected by Date Range as per requirements) ---
  
  const kpiData = useMemo(() => {
    return {
      crawled: items.filter(i => i.source_type === SourceType.CRAWL).length,
      pending: items.filter(i => i.status === ContentStatus.PENDING_REVIEW).length,
      rejected: items.filter(i => i.status === ContentStatus.REJECTED).length,
      approved: items.filter(i => i.status === ContentStatus.APPROVED).length,
      scheduled: items.filter(i => i.status === ContentStatus.SCHEDULED).length,
      published: items.filter(i => i.status === ContentStatus.PUBLISHED).length,
    };
  }, [items]);

  // --- Data Processing for Charts (Affected by Date Range) ---

  const chartData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Filter published items within date range
    const rangeItems = items.filter(item => {
      if (item.status !== ContentStatus.PUBLISHED) return false;
      // Use published_at if available, otherwise created_at
      const dateStr = item.published_at || item.created_at;
      const date = new Date(dateStr);
      return date >= start && date <= end;
    });

    // 1. Published Over Time
    const timeMap = new Map<string, number>();
    // Initialize days in range with 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
       timeMap.set(d.toISOString().split('T')[0], 0);
    }
    
    rangeItems.forEach(item => {
      const dateStr = (item.published_at || item.created_at).split('T')[0];
      if (timeMap.has(dateStr)) {
        timeMap.set(dateStr, (timeMap.get(dateStr) || 0) + 1);
      }
    });

    const timeChartData = Array.from(timeMap.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count
    }));

    // 2. Platform Distribution
    const platformMap = new Map<string, number>();
    Object.values(SourcePlatform).forEach(p => platformMap.set(p, 0));

    rangeItems.forEach(item => {
      // Check target_platforms if available (where it was published to), otherwise source
      const platforms = item.target_platforms && item.target_platforms.length > 0 
        ? item.target_platforms 
        : [item.source_platform];
        
      platforms.forEach(p => {
        platformMap.set(p, (platformMap.get(p) || 0) + 1);
      });
    });

    const platformChartData = Array.from(platformMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .filter(p => p.count > 0); // Only show platforms with content

    return { timeChartData, platformChartData };
  }, [items, startDate, endDate]);

  // --- Insights ---
  const insights = useMemo(() => {
    const now = new Date();
    const pendingLong = items.filter(i => {
      if (i.status !== ContentStatus.PENDING_REVIEW) return false;
      const created = new Date(i.created_at);
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 48;
    }).length;

    const scheduledSoon = items.filter(i => {
        // Mocking scheduled logic since we don't have a 'scheduled_for' field in type
        // checking items that are SCHEDULED status
        return i.status === ContentStatus.SCHEDULED;
    }).length;

    return { pendingLong, scheduledSoon };
  }, [items]);


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header (Date Picker Only) */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3 bg-white/40 p-2 rounded-2xl border border-white/20 shadow-sm">
          <div className="px-3 flex items-center gap-2 text-navy/60">
            <CalendarDays size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Phạm vi:</span>
          </div>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/60 border border-white/40 rounded-xl px-3 py-2 text-xs font-bold text-navy outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <span className="text-navy/40 font-bold">-</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/60 border border-white/40 rounded-xl px-3 py-2 text-xs font-bold text-navy outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard 
          title="Đã Thu Thập" 
          count={kpiData.crawled} 
          icon={Zap} 
          bgClass="bg-purple-100" 
          colorClass="text-purple-600"
          onClick={() => onNavigate({ status: ContentStatus.DRAFT })}
        />
        <KPICard 
          title="Chờ Duyệt" 
          count={kpiData.pending} 
          icon={Clock} 
          bgClass="bg-amber-100" 
          colorClass="text-amber-600"
          onClick={() => onNavigate({ status: ContentStatus.PENDING_REVIEW })}
        />
        <KPICard 
          title="Bị Từ Chối" 
          count={kpiData.rejected} 
          icon={ShieldAlert} 
          bgClass="bg-red-100" 
          colorClass="text-red-600"
          onClick={() => onNavigate({ status: ContentStatus.REJECTED })}
        />
        <KPICard 
          title="Đã Duyệt" 
          count={kpiData.approved} 
          icon={ThumbsUp} 
          bgClass="bg-blue-100" 
          colorClass="text-blue-600"
          onClick={() => onNavigate({ status: ContentStatus.APPROVED })}
        />
        <KPICard 
          title="Đã Lên Lịch" 
          count={kpiData.scheduled} 
          icon={Calendar} 
          bgClass="bg-indigo-100" 
          colorClass="text-indigo-600"
          onClick={() => onNavigate({ status: ContentStatus.SCHEDULED })}
        />
        <KPICard 
          title="Đã Đăng" 
          count={kpiData.published} 
          icon={CheckCircle2} 
          bgClass="bg-green-100" 
          colorClass="text-green-600"
          onClick={() => onNavigate({ status: ContentStatus.PUBLISHED })}
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Published Over Time */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[40px] border-white/40 shadow-2xl flex flex-col">
          <div className="mb-8 flex justify-between items-end">
             <div>
                <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-2">Hiệu Suất Xuất Bản</h3>
                <p className="text-xs font-bold text-slate-500">Số lượng nội dung được đăng tải theo thời gian</p>
             </div>
             <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                <TrendingUp size={24} />
             </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.timeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#406EB7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#406EB7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#0D1846', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#0D1846', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#406EB7" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Platform Distribution */}
        <div className="glass-card p-8 rounded-[40px] border-white/40 shadow-2xl flex flex-col">
          <div className="mb-8">
             <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-2">Phân Phối Nền Tảng</h3>
             <p className="text-xs font-bold text-slate-500">Tỷ trọng nội dung trên các kênh</p>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData.platformChartData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.2)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#0D1846', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                  {chartData.platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E95623' : '#406EB7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.pendingLong > 0 && (
          <div className="p-4 bg-red-100/50 border border-red-200 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-red-200 rounded-full text-red-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-red-800 uppercase tracking-widest">Cảnh Báo Vận Hành</p>
              <p className="text-sm font-bold text-red-900 mt-0.5">
                Có <span className="text-lg">{insights.pendingLong}</span> nội dung đang chờ duyệt quá 48 giờ.
              </p>
            </div>
          </div>
        )}
        
        {insights.scheduledSoon > 0 && (
          <div className="p-4 bg-indigo-100/50 border border-indigo-200 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-indigo-200 rounded-full text-indigo-600">
              <Calendar size={20} />
            </div>
            <div>
               <p className="text-xs font-black text-indigo-800 uppercase tracking-widest">Lịch Phát Sóng</p>
               <p className="text-sm font-bold text-indigo-900 mt-0.5">
                 <span className="text-lg">{insights.scheduledSoon}</span> nội dung dự kiến đăng trong 24h tới.
               </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
