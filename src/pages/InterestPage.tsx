import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ZAxis, BarChart, Bar, Cell, ReferenceLine, Label,
} from "recharts";

const ACCENT = "#3B82A0";

const bubbleData = [
  { name: "AI Fundamentals", demand: 78, growth: 12, registrations: 4200 },
  { name: "GenAI", demand: 85, growth: 28, registrations: 5100 },
  { name: "Data Ethics", demand: 35, growth: 22, registrations: 1800 },
  { name: "Automation", demand: 62, growth: 8, registrations: 3400 },
  { name: "Cloud Computing", demand: 55, growth: 15, registrations: 2900 },
  { name: "Cybersecurity", demand: 70, growth: 18, registrations: 3800 },
  { name: "Data Analytics", demand: 72, growth: 10, registrations: 3600 },
  { name: "UX Design", demand: 28, growth: 6, registrations: 1200 },
];

const trackDetails: Record<string, { demand: string; growth: string; insights: string[] }> = {
  "GenAI": {
    demand: "High",
    growth: "+28%",
    insights: [
      "Fastest-growing track, driven by employer demand for generative AI skills.",
      "Strong interest from career changers (35% of registrants in transition).",
      "University channel accounts for 42% of GenAI enrollments.",
    ],
  },
  "AI Fundamentals": {
    demand: "High",
    growth: "+12%",
    insights: [
      "Foundational track with consistent demand across all channels.",
      "Popular among public sector workers seeking digital upskilling.",
      "Completion rate of 68% — highest across all tracks.",
    ],
  },
  "Data Ethics": {
    demand: "Low",
    growth: "+22%",
    insights: [
      "Emerging interest driven by regulatory changes and AI governance discussions.",
      "NGO channel overrepresented (38% of enrollees).",
      "Growth rate suggests increasing relevance for policy roles.",
    ],
  },
  "Automation": {
    demand: "Moderate",
    growth: "+8%",
    insights: [
      "Stable demand primarily from employer-linked registrations.",
      "Strong presence in manufacturing and logistics sectors.",
      "Lower growth rate indicates market maturity in this domain.",
    ],
  },
};

const motivationData = [
  { reason: "Career Growth", pct: 38 },
  { reason: "Job Transition", pct: 24 },
  { reason: "Productivity", pct: 18 },
  { reason: "Certification", pct: 12 },
  { reason: "Curiosity", pct: 8 },
];

const challengeData = [
  { challenge: "Connectivity Issues", pct: 42 },
  { challenge: "Time Constraints", pct: 36 },
  { challenge: "Lack of Devices", pct: 28 },
  { challenge: "Language Barrier", pct: 22 },
  { challenge: "Cost of Internet", pct: 18 },
  { challenge: "Low Digital Literacy", pct: 15 },
  { challenge: "Lack of Awareness", pct: 11 },
];

const CustomBubbleTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E8E9ED] shadow-lg rounded-lg px-4 py-3" style={{ fontSize: '12px' }}>
      <p style={{ fontWeight: 600, color: '#1A1D26', marginBottom: '4px' }}>{d.name}</p>
      <p style={{ color: '#6B7085' }}>Demand Volume: <span style={{ fontWeight: 500, color: '#1A1D26' }}>{d.demand}</span></p>
      <p style={{ color: '#6B7085' }}>Growth Rate: <span style={{ fontWeight: 500, color: '#1A1D26' }}>{d.growth}%</span></p>
      <p style={{ color: '#6B7085' }}>Registrations: <span style={{ fontWeight: 500, color: '#1A1D26' }}>{d.registrations.toLocaleString()}</span></p>
    </div>
  );
};

const CustomBubbleLabel = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload || !payload.name) return null;
  return (
    <text x={cx} y={cy - 16} textAnchor="middle" fill="#4A4E5F" style={{ fontSize: '10.5px', fontWeight: 500 }}>
      {payload.name}
    </text>
  );
};

export default function InterestStrategyPage() {
  const [selectedTrack, setSelectedTrack] = useState("GenAI");
  const track = trackDetails[selectedTrack] || trackDetails["GenAI"];

  return (
    <div className="space-y-6">
      {/* Strategic Opportunity Matrix */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26', marginBottom: '2px' }}>
          Strategic Opportunity Matrix
        </h3>
        <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '20px' }}>
          Bubble size reflects total registrations · Click a bubble to update the insight panel below
        </p>
        <div className="relative">
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 30, right: 40, bottom: 30, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
              <XAxis
                type="number"
                dataKey="demand"
                name="Demand Volume"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#9CA0B0' }}
                axisLine={{ stroke: '#E8E9ED' }}
              >
                <Label value="Demand Volume →" position="bottom" offset={10} style={{ fontSize: '11.5px', fill: '#6B7085' }} />
              </XAxis>
              <YAxis
                type="number"
                dataKey="growth"
                name="Growth Rate (%)"
                domain={[0, 35]}
                tick={{ fontSize: 11, fill: '#9CA0B0' }}
                axisLine={{ stroke: '#E8E9ED' }}
              >
                <Label value="Growth Rate (%) →" angle={-90} position="insideLeft" offset={-20} style={{ fontSize: '11.5px', fill: '#6B7085' }} />
              </YAxis>
              <ZAxis type="number" dataKey="registrations" range={[300, 1200]} />
              <ReferenceLine x={50} stroke="#DDE0E7" strokeDasharray="4 4" />
              <ReferenceLine y={15} stroke="#DDE0E7" strokeDasharray="4 4" />
              <Tooltip content={<CustomBubbleTooltip />} />
              <Scatter
                data={bubbleData}
                fill={ACCENT}
                fillOpacity={0.65}
                stroke={ACCENT}
                strokeWidth={1}
                cursor="pointer"
                onClick={(data: any) => {
                  if (trackDetails[data.name]) setSelectedTrack(data.name);
                }}
                label={<CustomBubbleLabel />}
              />
            </ScatterChart>
          </ResponsiveContainer>
          {/* Quadrant labels */}
          <div className="absolute top-[38px] right-[50px] text-right" style={{ fontSize: '10px', fontWeight: 500, color: '#3B82A0', opacity: 0.7 }}>
            Priority Investment
          </div>
          <div className="absolute top-[38px] left-[50px]" style={{ fontSize: '10px', fontWeight: 500, color: '#9CA0B0', opacity: 0.7 }}>
            Emerging Opportunity
          </div>
          <div className="absolute bottom-[40px] right-[50px] text-right" style={{ fontSize: '10px', fontWeight: 500, color: '#6B7085', opacity: 0.7 }}>
            Stable Core
          </div>
          <div className="absolute bottom-[40px] left-[50px]" style={{ fontSize: '10px', fontWeight: 500, color: '#B0B3C0', opacity: 0.7 }}>
            Low Priority
          </div>
        </div>
      </div>

      {/* Interest + Motivation Insights */}
      <div className="grid grid-cols-2 gap-6">
        {/* Track summary */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26' }}>Track Summary</h3>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-[#DDE0E7] bg-white text-[#1A1D26] cursor-pointer"
              style={{ fontSize: '12.5px' }}
            >
              {Object.keys(trackDetails).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="px-3 py-1.5 rounded-lg bg-[#EBF4F8]">
              <p style={{ fontSize: '10.5px', color: '#6B7085' }}>Demand Level</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#3B82A0' }}>{track.demand}</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#F0FBF0]">
              <p style={{ fontSize: '10.5px', color: '#6B7085' }}>Growth</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2D8B4E' }}>{track.growth}</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#F5F5F7]">
              <p style={{ fontSize: '10.5px', color: '#6B7085' }}>Selected Track</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26' }}>{selectedTrack}</p>
            </div>
          </div>
          <ul className="space-y-3">
            {track.insights.map((ins, i) => (
              <li key={i} className="flex gap-2" style={{ fontSize: '12.5px', color: '#4A4E5F', lineHeight: '1.5' }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82A0] flex-shrink-0" />
                {ins}
              </li>
            ))}
          </ul>
        </div>

        {/* Motivation breakdown */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26', marginBottom: '4px' }}>
            Motivation Breakdown
          </h3>
          <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '20px' }}>
            Primary reasons learners enroll in upskilling tracks
          </p>
          <div className="space-y-4">
            {motivationData.map((d, i) => (
              <div key={d.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: '12.5px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1A1D26' : '#4A4E5F' }}>
                    {d.reason}
                    {i === 0 && <span className="ml-2 px-1.5 py-0.5 rounded text-white bg-[#3B82A0]" style={{ fontSize: '9.5px', fontWeight: 600 }}>TOP</span>}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1D26' }}>{d.pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#F0F1F3] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.pct / 38) * 100}%`,
                      backgroundColor: i === 0 ? ACCENT : `${ACCENT}${i === 1 ? 'B0' : '70'}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Severity Index */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D26' }}>
            Challenge Severity Index
          </h3>
        </div>
        <p style={{ fontSize: '11.5px', color: '#9CA0B0', marginBottom: '20px' }}>
          Higher values indicate stronger barriers to participation.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={challengeData} layout="vertical" margin={{ left: 140, right: 50, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" horizontal={false} />
            <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 11, fill: '#9CA0B0' }} axisLine={{ stroke: '#E8E9ED' }} unit="%" />
            <YAxis
              type="category"
              dataKey="challenge"
              tick={{ fontSize: 12, fill: '#4A4E5F' }}
              width={130}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #E8E9ED', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(val: number) => [`${val}%`, "Severity"]}
            />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={20}
              label={{ position: 'right', fill: '#4A4E5F', fontSize: 11.5, fontWeight: 500, formatter: (v: number) => `${v}%` }}
            >
              {challengeData.map((_, i) => {
                const intensity = 1 - i * 0.1;
                return <Cell key={i} fill={`rgba(180, 60, 60, ${Math.max(0.25, intensity * 0.7)})`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}