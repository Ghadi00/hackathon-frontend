import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
import QueryApi from "../shared/api/query-api";

const CHANNELS = ["Universities", "Syndicates", "Public Sector", "NGOs", "Employers"];
const ACCENT = "#3B82A0";
const COLORS = ["#3B82A0", "#5EAEC5", "#8BCADB", "#2E6B82", "#174F64"];

const barData = [
  { channel: "Universities", count: 4820 },
  { channel: "Syndicates", count: 2315 },
  { channel: "Public Sector", count: 3640 },
  { channel: "NGOs", count: 1890 },
  { channel: "Employers", count: 2960 },
];

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const lineData = [
  { month: "Sep", Universities: 640, Syndicates: 310, "Public Sector": 480, NGOs: 230, Employers: 390 },
  { month: "Oct", Universities: 790, Syndicates: 380, "Public Sector": 610, NGOs: 285, Employers: 470 },
  { month: "Nov", Universities: 920, Syndicates: 445, "Public Sector": 720, NGOs: 340, Employers: 560 },
  { month: "Dec", Universities: 1050, Syndicates: 510, "Public Sector": 830, NGOs: 395, Employers: 650 },
  { month: "Jan", Universities: 1210, Syndicates: 590, "Public Sector": 960, NGOs: 450, Employers: 740 },
  { month: "Feb", Universities: 1380, Syndicates: 670, "Public Sector": 1090, NGOs: 520, Employers: 840 },
];

const pieData = [
  { name: "Universities", value: 30.8 },
  { name: "Syndicates", value: 14.8 },
  { name: "Public Sector", value: 23.3 },
  { name: "NGOs", value: 12.1 },
  { name: "Employers", value: 19.0 },
];

const drillDownData: Record<string, { name: string; count: number }[]> = {
  Universities: [
    { name: "Lebanese University (LU)", count: 1120 },
    { name: "Université Saint-Joseph (USJ)", count: 890 },
    { name: "American University of Beirut (AUB)", count: 720 },
    { name: "Lebanese American University (LAU)", count: 585 },
    { name: "Université Saint-Esprit de Kaslik", count: 340 },
    { name: "Beirut Arab University", count: 310 },
    { name: "Notre Dame University", count: 245 },
    { name: "University of Balamand", count: 195 },
    { name: "Haigazian University", count: 170 },
    { name: "Antonine University", count: 135 },
    { name: "Islamic University of Lebanon", count: 72 },
    { name: "Global University", count: 38 },
  ],
  Syndicates: [
    { name: "Engineers Syndicate", count: 680 },
    { name: "Lawyers Syndicate", count: 420 },
    { name: "Pharmacists Syndicate", count: 380 },
    { name: "Dentists Syndicate", count: 310 },
    { name: "Press Syndicate", count: 215 },
    { name: "Accountants Syndicate", count: 170 },
    { name: "Contractors Syndicate", count: 140 },
  ],
  "Public Sector": [
    { name: "Ministry of Education", count: 920 },
    { name: "Ministry of Labor", count: 680 },
    { name: "Central Administration of Statistics", count: 520 },
    { name: "Ministry of Social Affairs", count: 480 },
    { name: "Council for Development and Reconstruction", count: 410 },
    { name: "Office of the Minister of State for IT", count: 340 },
    { name: "Civil Service Board", count: 290 },
  ],
  NGOs: [
    { name: "Teach For Lebanon", count: 420 },
    { name: "Digital Opportunity Trust", count: 350 },
    { name: "LSESD", count: 310 },
    { name: "Nawaya Network", count: 280 },
    { name: "Ruwwad Al Tanmeya", count: 240 },
    { name: "Beyond Association", count: 180 },
    { name: "Basmeh & Zeitooneh", count: 110 },
  ],
  Employers: [
    { name: "Banque du Liban (Branches)", count: 540 },
    { name: "Majid Al Futtaim Group", count: 420 },
    { name: "Azadea Group", count: 380 },
    { name: "Fransabank", count: 350 },
    { name: "BLOM Bank", count: 320 },
    { name: "Middle East Airlines", count: 290 },
    { name: "LibanPost", count: 260 },
    { name: "Touch / Alfa (Telecom)", count: 220 },
    { name: "Murex S.A.S.", count: 180 },
  ],
};

const CustomBarLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="#4A4E5F" style={{ fontSize: '11.5px', fontWeight: 500 }}>
      {value.toLocaleString()}
    </text>
  );
};

export default function DisseminationPage() {
  const { data: registrationsRes } = useQuery({
    queryKey: ["performance", "registrations"],
    queryFn: QueryApi.dashboard.getPerformanceRegistrations,
  });

  const registrationChannels = Array.isArray(registrationsRes?.channels)
    ? registrationsRes.channels
    : [];

  const formatChannel = (value: string) => value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const barDataSource: { channel: string; count: number }[] = registrationChannels.length > 0
    ? registrationChannels.map((item: any) => ({
      channel: formatChannel(String(item.channel ?? "Unknown")),
      count: Number(item.count) || 0,
    }))
    : barData;

  const channels = barDataSource.map((item: { channel: string; count: number }) => item.channel);
  const totalRegistrations = barDataSource.reduce((sum: number, item: { channel: string; count: number }) => sum + item.count, 0);
  const pieDataSource: { name: string; value: number }[] = totalRegistrations > 0
    ? barDataSource.map((item) => ({
      name: item.channel,
      value: Number(((item.count / totalRegistrations) * 100).toFixed(1)),
    }))
    : pieData;

  const drillDownDataSource: Record<string, { name: string; count: number }[]> = registrationChannels.length > 0
    ? registrationChannels.reduce((acc: Record<string, { name: string; count: number }[]>, item: any) => {
      const channelName = formatChannel(String(item.channel ?? "Unknown"));
      acc[channelName] = Array.isArray(item.learners)
        ? item.learners.map((learner: any) => ({ name: learner.respondant_name, count: 1 }))
        : [];
      return acc;
    }, {})
    : drillDownData;

  const [expandedChart, setExpandedChart] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("6 months");
  const [activeLine, setActiveLine] = useState<Record<string, boolean>>(
    Object.fromEntries(CHANNELS.map((c) => [c, true]))
  );
  const [drillDown, setDrillDown] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || "Universities");
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const handlePieClick = useCallback((_: any, index: number) => {
    setSelectedChannel(pieDataSource[index].name);
    setDrillDown(pieDataSource[index].name);
  }, [pieDataSource]);

  const toggleLine = (channel: string) => {
    setActiveLine((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  // Drill Down View
  if (drillDown) {
    const data = drillDownDataSource[selectedChannel] || [];
    return (
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#6B7085' }}>
          <button onClick={() => setDrillDown(null)} className="text-[#3B82A0] hover:underline cursor-pointer" style={{ fontWeight: 500 }}>
            Dissemination
          </button>
          <ChevronRight size={14} />
          <span style={{ color: '#1A1D26', fontWeight: 500 }}>Provenance Details</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1D26' }}>Provenance Details</h2>
              <p style={{ fontSize: '12.5px', color: '#9CA0B0', marginTop: '2px' }}>
                Registration breakdown by entity within selected channel
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label style={{ fontSize: '12.5px', color: '#6B7085', fontWeight: 500 }}>Select Channel:</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-[#DDE0E7] bg-white text-[#1A1D26] cursor-pointer"
                style={{ fontSize: '13px' }}
              >
                {channels.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={() => setDrillDown(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#DDE0E7] text-[#4A4E5F] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                style={{ fontSize: '12.5px', fontWeight: 500 }}
              >
                <ChevronLeft size={14} />
                Back to Dissemination
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={Math.max(400, data.length * 44)}>
            <BarChart data={data} layout="vertical" margin={{ left: 200, right: 60, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#4A4E5F' }}
                width={190}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val: number) => [val.toLocaleString(), "Registrations"]}
              />
              <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#4A4E5F', fontSize: 11.5, fontWeight: 500, formatter: (v: number) => v.toLocaleString() }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Expanded Chart Modal
  if (expandedChart) {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-8" onClick={() => setExpandedChart(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-[1100px] max-h-[90vh] overflow-auto p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1D26' }}>Growth Metrics — Expanded View</h2>
              <p style={{ fontSize: '12.5px', color: '#9CA0B0', marginTop: '2px' }}>Registrations over time by dissemination channel</p>
            </div>
            <div className="flex items-center gap-3">
              {["Last 30 days", "6 months", "12 months"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    timeRange === r ? "bg-[#3B82A0] text-white" : "border border-[#DDE0E7] text-[#4A4E5F] hover:bg-[#F3F4F6]"
                  }`}
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {r}
                </button>
              ))}
              <button onClick={() => setExpandedChart(false)} className="p-1.5 rounded-md hover:bg-[#F3F4F6] cursor-pointer">
                <Minimize2 size={16} className="text-[#6B7085]" />
              </button>
            </div>
          </div>

          {/* Legend toggles */}
          <div className="flex items-center gap-4 mb-5">
            {CHANNELS.map((c, i) => (
              <button
                key={c}
                onClick={() => toggleLine(c)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeLine[c] ? "opacity-100" : "opacity-40"
                }`}
                style={{ fontSize: '12px', fontWeight: 500, color: '#4A4E5F' }}
              >
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                {c}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              {CHANNELS.map((c, i) =>
                activeLine[c] ? (
                  <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Summary table */}
          <div className="mt-6 border-t border-[#E8E9ED] pt-4">
            <p style={{ fontSize: '12.5px', fontWeight: 500, color: '#6B7085', marginBottom: '8px' }}>Summary (Latest Month)</p>
            <div className="grid grid-cols-5 gap-4">
              {barDataSource.map((d: { channel: string; count: number }, i: number) => (
                <div key={d.channel} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <p style={{ fontSize: '11.5px', color: '#6B7085' }}>{d.channel}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26' }}>{d.count.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="flex gap-6">
      {/* LEFT COLUMN */}
      <div className="w-[400px] min-w-[400px] space-y-6">
        {/* Bar Chart Card */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-5">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26', marginBottom: '4px' }}>
            Registrations by Channel (Count)
          </h3>
          <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '16px' }}>
            Total registrations per dissemination channel
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barDataSource} margin={{ left: -10, right: 10, top: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
              <XAxis dataKey="channel" tick={{ fontSize: 10.5, fill: '#6B7085' }} axisLine={{ stroke: '#E8E9ED' }} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 10.5, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val: number) => [val.toLocaleString(), "Registrations"]}
              />
              <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} barSize={36} label={<CustomBarLabel />} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart Card */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26' }}>
              Growth Metrics (Registrations Over Time)
            </h3>
            <button
              onClick={() => setExpandedChart(true)}
              className="p-1.5 rounded-md hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              title="Expand chart"
            >
              <Maximize2 size={15} className="text-[#6B7085]" />
            </button>
          </div>
          <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '16px' }}>
            Monthly trend by channel
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} />
              <YAxis tick={{ fontSize: 10.5, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} />
              <Tooltip contentStyle={{ fontSize: '11.5px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Legend
                iconType="square"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#6B7085', paddingTop: '8px' }}
              />
              {CHANNELS.map((c, i) => (
                <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i]} strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6 h-full">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26', marginBottom: '4px' }}>
            Channel Distribution (Percentage)
          </h3>
          <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '4px' }}>
            Click a slice to drill down into channel provenance details
          </p>

          <div className="flex items-center justify-center" style={{ minHeight: '420px' }}>
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={pieDataSource}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={hoveredSlice !== null ? undefined : 160}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  onClick={handlePieClick}
                  onMouseEnter={(_, i) => setHoveredSlice(i)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  cursor="pointer"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: '#C5C8D4', strokeWidth: 1 }}
                  style={{ outline: 'none' }}
                >
                  {pieDataSource.map((_: { name: string; value: number }, i: number) => (
                    <Cell
                      key={i}
                      fill={COLORS[i]}
                      outerRadius={hoveredSlice === i ? 172 : 160}
                      style={{ outline: 'none', transition: 'all 0.2s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(val: number, name: string) => {
                    const item = barDataSource.find((b: { channel: string; count: number }) => b.channel === name);
                    return [`${val}% (${item ? item.count.toLocaleString() : "—"} registrations)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-5 mt-4">
            {pieDataSource.map((d: { name: string; value: number }, i: number) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                <span style={{ fontSize: '12px', color: '#4A4E5F' }}>{d.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1D26' }}>{d.value}%</span>
              </div>
            ))}
          </div>

          <p className="text-center mt-5" style={{ fontSize: '11.5px', color: '#9CA0B0' }}>
            Click any slice to view provenance details for that channel →
          </p>
        </div>
      </div>
    </div>
  );
}
