import { useState, useRef, useEffect, useCallback } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { AlertTriangle, X, TrendingUp, TrendingDown, Users, BookOpen, Radio, MapPin } from "lucide-react";

const ACCENT = "#3B82A0";
const COLORS = ["#3B82A0", "#5EAEC5", "#8BCADB", "#2E6B82"];

// 6-step teal density scale
const DENSITY_SCALE = [
  { color: "#E8F4F8", label: "< 500", min: 0, max: 500 },
  { color: "#B8DAE6", label: "500–1K", min: 500, max: 1000 },
  { color: "#7CBDD1", label: "1K–2K", min: 1000, max: 2000 },
  { color: "#4A9DB5", label: "2K–3K", min: 2000, max: 3000 },
  { color: "#2E7D94", label: "3K–4K", min: 3000, max: 4000 },
  { color: "#1B5E73", label: "4K+", min: 4000, max: Infinity },
];

function getDensityColor(registrations: number): string {
  for (const step of DENSITY_SCALE) {
    if (registrations < step.max) return step.color;
  }
  return DENSITY_SCALE[DENSITY_SCALE.length - 1].color;
}

interface Region {
  id: string;
  name: string;
  registrations: number;
  dominantTrack: string;
  completionRate: number;
  strongestChannel: string;
  underrepresented: boolean;
  equityProfile: string;
  population: number;
  registrationTrend: number;
  topProvider: string;
  radar: { axis: string; value: number }[];
  channels: { name: string; count: number }[];
}

const regions: Region[] = [
  {
    id: "beirut",
    name: "Beirut",
    registrations: 4820,
    dominantTrack: "GenAI",
    completionRate: 72,
    strongestChannel: "Universities",
    underrepresented: false,
    equityProfile: "Balanced",
    population: 361366,
    registrationTrend: 12.4,
    topProvider: "AUB / LAU",
    radar: [
      { axis: "Registration Rate", value: 92 },
      { axis: "Track Diversity", value: 85 },
      { axis: "Completion Rate", value: 72 },
      { axis: "Channel Diversity", value: 88 },
    ],
    channels: [
      { name: "Universities", count: 1860 },
      { name: "NGOs", count: 920 },
      { name: "Employers", count: 1140 },
      { name: "Public Sector", count: 900 },
    ],
  },
  {
    id: "mount-lebanon",
    name: "Mount Lebanon",
    registrations: 3640,
    dominantTrack: "AI Fundamentals",
    completionRate: 68,
    strongestChannel: "Employers",
    underrepresented: false,
    equityProfile: "Balanced",
    population: 2000000,
    registrationTrend: 8.2,
    topProvider: "USEK / NDU",
    radar: [
      { axis: "Registration Rate", value: 80 },
      { axis: "Track Diversity", value: 72 },
      { axis: "Completion Rate", value: 68 },
      { axis: "Channel Diversity", value: 76 },
    ],
    channels: [
      { name: "Universities", count: 980 },
      { name: "NGOs", count: 620 },
      { name: "Employers", count: 1240 },
      { name: "Public Sector", count: 800 },
    ],
  },
  {
    id: "north",
    name: "North Lebanon",
    registrations: 2180,
    dominantTrack: "Automation",
    completionRate: 54,
    strongestChannel: "NGOs",
    underrepresented: false,
    equityProfile: "Moderate",
    population: 800000,
    registrationTrend: 5.1,
    topProvider: "UOB / Safadi Foundation",
    radar: [
      { axis: "Registration Rate", value: 58 },
      { axis: "Track Diversity", value: 45 },
      { axis: "Completion Rate", value: 54 },
      { axis: "Channel Diversity", value: 50 },
    ],
    channels: [
      { name: "Universities", count: 420 },
      { name: "NGOs", count: 780 },
      { name: "Employers", count: 520 },
      { name: "Public Sector", count: 460 },
    ],
  },
  {
    id: "akkar",
    name: "Akkar",
    registrations: 620,
    dominantTrack: "AI Fundamentals",
    completionRate: 38,
    strongestChannel: "NGOs",
    underrepresented: true,
    equityProfile: "Needs Support",
    population: 390000,
    registrationTrend: -2.3,
    topProvider: "Akkar NGO Cluster",
    radar: [
      { axis: "Registration Rate", value: 22 },
      { axis: "Track Diversity", value: 18 },
      { axis: "Completion Rate", value: 38 },
      { axis: "Channel Diversity", value: 25 },
    ],
    channels: [
      { name: "Universities", count: 60 },
      { name: "NGOs", count: 310 },
      { name: "Employers", count: 110 },
      { name: "Public Sector", count: 140 },
    ],
  },
  {
    id: "baalbek-hermel",
    name: "Baalbek-Hermel",
    registrations: 780,
    dominantTrack: "Data Ethics",
    completionRate: 41,
    strongestChannel: "Public Sector",
    underrepresented: true,
    equityProfile: "Needs Support",
    population: 416427,
    registrationTrend: -1.8,
    topProvider: "UNDP Local Partners",
    radar: [
      { axis: "Registration Rate", value: 26 },
      { axis: "Track Diversity", value: 22 },
      { axis: "Completion Rate", value: 41 },
      { axis: "Channel Diversity", value: 28 },
    ],
    channels: [
      { name: "Universities", count: 80 },
      { name: "NGOs", count: 240 },
      { name: "Employers", count: 140 },
      { name: "Public Sector", count: 320 },
    ],
  },
  {
    id: "bekaa",
    name: "Bekaa",
    registrations: 1680,
    dominantTrack: "Data Ethics",
    completionRate: 51,
    strongestChannel: "NGOs",
    underrepresented: true,
    equityProfile: "Needs Support",
    population: 540000,
    registrationTrend: 1.5,
    topProvider: "Bekaa Valley Initiative",
    radar: [
      { axis: "Registration Rate", value: 42 },
      { axis: "Track Diversity", value: 38 },
      { axis: "Completion Rate", value: 51 },
      { axis: "Channel Diversity", value: 40 },
    ],
    channels: [
      { name: "Universities", count: 280 },
      { name: "NGOs", count: 620 },
      { name: "Employers", count: 380 },
      { name: "Public Sector", count: 400 },
    ],
  },
  {
    id: "south",
    name: "South Lebanon",
    registrations: 1420,
    dominantTrack: "AI Fundamentals",
    completionRate: 48,
    strongestChannel: "Public Sector",
    underrepresented: true,
    equityProfile: "Needs Support",
    population: 402000,
    registrationTrend: -0.7,
    topProvider: "Tyre Municipal Partnership",
    radar: [
      { axis: "Registration Rate", value: 38 },
      { axis: "Track Diversity", value: 32 },
      { axis: "Completion Rate", value: 48 },
      { axis: "Channel Diversity", value: 35 },
    ],
    channels: [
      { name: "Universities", count: 210 },
      { name: "NGOs", count: 380 },
      { name: "Employers", count: 290 },
      { name: "Public Sector", count: 540 },
    ],
  },
  {
    id: "nabatieh",
    name: "Nabatieh",
    registrations: 890,
    dominantTrack: "Automation",
    completionRate: 44,
    strongestChannel: "Public Sector",
    underrepresented: true,
    equityProfile: "Needs Support",
    population: 330000,
    registrationTrend: 0.3,
    topProvider: "ILO South Lebanon",
    radar: [
      { axis: "Registration Rate", value: 28 },
      { axis: "Track Diversity", value: 22 },
      { axis: "Completion Rate", value: 44 },
      { axis: "Channel Diversity", value: 30 },
    ],
    channels: [
      { name: "Universities", count: 120 },
      { name: "NGOs", count: 240 },
      { name: "Employers", count: 180 },
      { name: "Public Sector", count: 350 },
    ],
  },
];

// SVG paths from the real Lebanon ADM1 boundary data
// Mapped to governorates by geographic position
const REGION_PATHS: { id: string; paths: string[]; labelX: number; labelY: number }[] = [
  {
    id: "baalbek-hermel",
    paths: [
      "M 507.91 464.27 520.83 437.34 496.63 437.44 488.49 429.54 471.14 440.79 450.89 413.23 430.5 410.75 420.44 403.43 407.93 395.26 420.07 385.06 428.75 365.38 441.76 359.04 459.23 340.88 463.22 324.33 472.76 321 481.58 295.28 489.8 280.53 481.76 277.27 493.91 261.3 505.6 253.75 530.42 225.59 545.03 214.37 546.62 205.18 559.75 188.02 568.37 186.09 593.7 168.8 608.95 149.71 625.71 114.77 635.29 100.42 650.09 93.8 658.75 98.12 685.42 103.52 693.6 96.9 712.12 100.21 708.79 110.89 722.16 123.12 735.85 127.12 758.16 142.06 770.64 144.32 768.3 157.93 754.21 169.88 766.36 201.31 786.9 211.24 785.53 226.01 798.71 244.36 799 261.49 782.67 270.17 774.38 288.06 739.26 314.47 742.28 325.43 734.46 338.86 722.78 343.09 695.87 337.74 677.1 349.9 662.12 374.27 643.63 383.74 615.96 418.01 629.92 423.16 658.54 421.01 671.36 433.26 681.15 449.88 675.38 455.97 640.25 454.49 620.89 446.24 599.92 442.45 582.75 456.67 549.03 442.74 543.15 454.87 507.91 464.27 Z",
    ],
    labelX: 660,
    labelY: 280,
  },
  {
    id: "beirut",
    paths: [
      "M 230.27 419.53 214.39 439.67 198.21 437.21 192.18 422.32 213.07 416.16 230.27 419.53 Z",
    ],
    labelX: 212,
    labelY: 428,
  },
  {
    id: "north",
    paths: [
      "M 625.71 114.77 608.95 149.71 593.7 168.8 568.37 186.09 559.75 188.02 546.62 205.18 545.03 214.37 530.42 225.59 505.6 253.75 493.91 261.3 481.76 277.27 489.8 280.53 481.58 295.28 475.42 289.81 445.06 279.96 432.74 286.13 408.66 287.41 401.81 275.55 387.49 267.53 364.32 272.38 349.17 265.85 338.76 272.5 310.86 264.74 303.16 256.91 287.55 255.59 294.27 238.02 290.8 221.59 303.67 203.29 322.27 205.5 335.11 168.06 350.56 165.74 375.53 152.3 370.49 128.84 424.65 118.87 450.25 95.36 467.63 108.95 467.15 133.68 481.9 135.63 509.31 132.12 538.52 133.03 549.36 145.72 566.19 149.85 604.47 144.54 601.27 128.3 625.71 114.77 Z",
    ],
    labelX: 460,
    labelY: 200,
  },
  {
    id: "mount-lebanon",
    paths: [
      "M 407.93 395.26 420.44 403.43 406.09 412.94 364.7 453.96 367.24 460.13 356.17 477.96 372.37 480.48 364.97 495.74 347.09 510.07 331.92 531.81 315.2 539.6 301.33 562.69 280.39 615.59 274.07 638.09 270.69 620.77 258.79 603.76 260.08 585.44 241.25 582.92 227.82 591.04 197.14 595 192.47 599.99 149.05 585.26 155.2 558.78 165.36 546.25 163.77 533.61 174.18 528.52 183.73 497.79 194.78 483.22 199.59 459.88 198.21 437.21 214.39 439.67 230.27 419.53 248.21 417.06 260.2 390.02 267.13 396.24 295.72 399.58 326.02 392.33 337.6 386.45 382.82 383.82 407.93 395.26 Z",
      "M 481.58 295.28 472.76 321 463.22 324.33 459.23 340.88 441.76 359.04 428.75 365.38 420.07 385.06 407.93 395.26 382.82 383.82 337.6 386.45 326.02 392.33 295.72 399.58 267.13 396.24 260.2 390.02 284.57 364.76 273.72 357.29 288.62 321.28 288.38 307.85 275.6 289.62 280.22 263.94 287.55 255.59 303.16 256.91 310.86 264.74 338.76 272.5 349.17 265.85 364.32 272.38 387.49 267.53 401.81 275.55 408.66 287.41 432.74 286.13 445.06 279.96 475.42 289.81 481.58 295.28 Z",
    ],
    labelX: 340,
    labelY: 460,
  },
  {
    id: "south",
    paths: [
      "M 149.05 585.26 192.47 599.99 197.14 595 227.82 591.04 241.25 582.92 260.08 585.44 258.79 603.76 270.69 620.77 274.07 638.09 270.28 656.56 280.95 670.52 270.53 678.47 260.41 695 244.57 696.72 230.11 704.14 222.75 694.41 231.26 675.38 223.34 668.23 221.78 654.8 236.32 631.03 221.78 629.46 195.92 644.88 162.59 645.22 149.78 668.01 158.07 685.75 142.65 689.43 138.5 698.7 116.61 687.29 113.9 700.01 137.66 717.78 132.47 732.95 158.9 738.06 171.07 731.74 179.58 738.28 163.55 761.5 121.34 807.53 110.37 812.79 102.19 830.73 102.31 844.04 72.07 850.1 61.86 845.7 46.11 853.59 35.5 849.57 4.12 849.39 1 842.59 20.86 831.29 33.36 811.32 45.03 805.35 56.16 778.4 55.53 762.21 47.86 755.07 60.63 745.96 62.04 736.14 73.32 723.11 77.08 699.68 96.12 654.68 110.78 647.62 130.84 627.29 139.3 599.34 149.05 585.26 Z",
    ],
    labelX: 130,
    labelY: 720,
  },
  {
    id: "nabatieh",
    paths: [
      "M 102.31 844.04 102.19 830.73 110.37 812.79 121.34 807.53 163.55 761.5 179.58 738.28 171.07 731.74 158.9 738.06 132.47 732.95 137.66 717.78 113.9 700.01 116.61 687.29 138.5 698.7 142.65 689.43 158.07 685.75 149.78 668.01 162.59 645.22 195.92 644.88 221.78 629.46 236.32 631.03 221.78 654.8 223.34 668.23 231.26 675.38 222.75 694.41 230.11 704.14 244.57 696.72 260.41 695 270.53 678.47 280.95 670.52 296.57 672.62 306.76 657.72 337.08 644.67 344.93 649.06 342.85 663.9 353.63 675.49 371.42 674.35 378.3 663.03 399.74 676.82 382.64 687.18 375.91 708.95 341.27 725.68 326.78 724.59 321.36 734.5 295.85 751.87 273.87 754.77 273.26 762.12 242.79 755.82 230.17 777.08 232.93 793.57 220.72 837.38 212.25 851.12 185.33 850.23 173.64 864.87 126.37 866.1 117.94 850.56 102.31 844.04 Z",
    ],
    labelX: 240,
    labelY: 770,
  },
  {
    id: "bekaa",
    paths: [
      "M 420.44 403.43 430.5 410.75 450.89 413.23 471.14 440.79 488.49 429.54 496.63 437.44 520.83 437.34 507.91 464.27 487.35 491.54 478.99 488.11 468.54 502.14 440.79 514.04 454.25 526.73 439.36 555.32 483.99 570.59 500.66 582.47 504.5 591.61 485.69 610.59 467.49 606.74 443.87 619.2 437.08 630.05 445.46 642.13 440.1 653.27 399.74 676.82 378.3 663.03 371.42 674.35 353.63 675.49 342.85 663.9 344.93 649.06 337.08 644.67 306.76 657.72 296.57 672.62 280.95 670.52 270.28 656.56 274.07 638.09 280.39 615.59 301.33 562.69 315.2 539.6 331.92 531.81 347.09 510.07 364.97 495.74 372.37 480.48 356.17 477.96 367.24 460.13 364.7 453.96 406.09 412.94 420.44 403.43 Z",
    ],
    labelX: 410,
    labelY: 560,
  },
  {
    id: "akkar",
    paths: [
      "M 658.75 98.12 650.09 93.8 635.29 100.42 625.71 114.77 601.27 128.3 604.47 144.54 566.19 149.85 549.36 145.72 538.52 133.03 509.31 132.12 481.9 135.63 467.15 133.68 467.63 108.95 450.25 95.36 460.3 93.89 468.86 77.82 468.75 55.84 460.63 33.76 464.29 23.27 493 35.15 505.48 31.63 522.86 34.42 539 27.37 564.68 35.88 579.92 30.9 592.56 36.73 630.28 31.08 635.93 7.8 652.02 1 657.55 17.05 675.14 32.51 697.16 36.4 708.75 30.38 716.15 46.67 686.55 47.79 684.14 62.83 691.56 68.66 658.75 98.12 Z",
    ],
    labelX: 580,
    labelY: 70,
  },
];

// Tooltip component that follows the cursor
function MapTooltip({
  region,
  position,
}: {
  region: Region | null;
  position: { x: number; y: number };
}) {
  if (!region) return null;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: position.x + 16,
        top: position.y - 10,
        transform: "translateY(-50%)",
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg border border-[#E0E2E8] px-4 py-3 min-w-[220px]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D26" }}>
            {region.name}
          </span>
          {region.underrepresented && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FEF2F0]">
              <AlertTriangle size={10} className="text-[#B43C3C]" />
              <span style={{ fontSize: "9px", color: "#B43C3C", fontWeight: 500 }}>
                Low Coverage
              </span>
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Registrations", value: region.registrations.toLocaleString() },
            { label: "Dominant Track", value: region.dominantTrack },
            { label: "Completion Rate", value: `${region.completionRate}%` },
            { label: "Strongest Channel", value: region.strongestChannel },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span style={{ fontSize: "11px", color: "#9CA0B0" }}>{item.label}</span>
              <span style={{ fontSize: "11.5px", fontWeight: 500, color: "#1A1D26" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// The choropleth map component
function LebanonChoroplethMap({
  selectedRegion,
  onSelect,
  hoveredRegion,
  onHover,
  onMouseMove,
}: {
  selectedRegion: string;
  onSelect: (id: string) => void;
  hoveredRegion: string | null;
  onHover: (id: string | null) => void;
  onMouseMove: (e: React.MouseEvent) => void;
}) {
  return (
    <svg
      viewBox="-10 -10 820 890"
      className="w-full h-full"
      style={{ maxHeight: "480px" }}
      onMouseMove={onMouseMove}
    >
      <defs>
        {/* Drop shadow for selected region */}
        <filter id="selectedShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3B82A0" floodOpacity="0.25" />
        </filter>
        {/* Glow for hovered region */}
        <filter id="hoverGlow" x="-3%" y="-3%" width="106%" height="106%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#3B82A0" floodOpacity="0.15" />
        </filter>
        {/* Alert pattern for underrepresented */}
        <pattern id="alertHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#B43C3C" strokeWidth="0.5" strokeOpacity="0.2" />
        </pattern>
      </defs>

      {REGION_PATHS.map((rp) => {
        const region = regions.find((r) => r.id === rp.id);
        if (!region) return null;
        const isSelected = selectedRegion === rp.id;
        const isHovered = hoveredRegion === rp.id;
        const fillColor = getDensityColor(region.registrations);

        return (
          <g key={rp.id}>
            {rp.paths.map((pathD, idx) => (
              <g key={`${rp.id}-${idx}`}>
                {/* Main fill */}
                <path
                  d={pathD}
                  fill={fillColor}
                  stroke={
                    isSelected
                      ? ACCENT
                      : isHovered
                      ? "#5EAEC5"
                      : "#B8BCC8"
                  }
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 0.8}
                  className="cursor-pointer"
                  style={{
                    transition: "fill 0.2s ease, stroke 0.2s ease, stroke-width 0.15s ease",
                    filter: isSelected
                      ? "url(#selectedShadow)"
                      : isHovered
                      ? "url(#hoverGlow)"
                      : "none",
                    opacity: hoveredRegion && !isHovered && !isSelected ? 0.7 : 1,
                  }}
                  onClick={() => onSelect(rp.id)}
                  onMouseEnter={() => onHover(rp.id)}
                  onMouseLeave={() => onHover(null)}
                />
                {/* Underrepresented dashed border */}
                {region.underrepresented && !isSelected && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#B43C3C"
                    strokeWidth={1.2}
                    strokeDasharray="6 4"
                    strokeOpacity={0.5}
                    className="pointer-events-none"
                  />
                )}
              </g>
            ))}
            {/* Region label */}
            <text
              x={rp.labelX}
              y={rp.labelY}
              textAnchor="middle"
              fill={isSelected ? "#1A1D26" : "#4A4E5F"}
              className="pointer-events-none select-none"
              style={{
                fontSize: rp.id === "beirut" ? "8px" : "10px",
                fontWeight: isSelected ? 600 : 400,
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 0 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.7)",
              }}
            >
              {region.name}
            </text>
            {/* Underrepresented alert icon */}
            {region.underrepresented && (
              <g
                transform={`translate(${rp.labelX - 6}, ${rp.labelY - (rp.id === "beirut" ? 14 : 18)})`}
                className="pointer-events-none"
              >
                <circle cx="6" cy="6" r="7" fill="rgba(180, 60, 60, 0.12)" />
                <text
                  x="6"
                  y="10"
                  textAnchor="middle"
                  fill="#B43C3C"
                  style={{ fontSize: "9px" }}
                >
                  ⚠
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Density legend component
function DensityLegend() {
  return (
    <div className="mt-4 pt-4 border-t border-[#E8E9ED]">
      <p
        style={{
          fontSize: "10.5px",
          color: "#9CA0B0",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: 500,
        }}
      >
        Registration Density
      </p>
      <div className="grid grid-cols-6 gap-1">
        {DENSITY_SCALE.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-full h-3 rounded-sm"
              style={{
                backgroundColor: step.color,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />
            <span style={{ fontSize: "9px", color: "#9CA0B0" }}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-0.5"
            style={{
              borderTop: "1.5px dashed #B43C3C",
              opacity: 0.6,
            }}
          />
          <span style={{ fontSize: "9.5px", color: "#9CA0B0" }}>Underrepresented</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ border: `2px solid ${ACCENT}` }}
          />
          <span style={{ fontSize: "9.5px", color: "#9CA0B0" }}>Selected</span>
        </div>
      </div>
    </div>
  );
}

// Selected region detail panel
function RegionDetailPanel({
  region,
  onClose,
}: {
  region: Region;
  onClose: () => void;
}) {
  const equityColor =
    region.equityProfile === "Balanced"
      ? "#2D8B4E"
      : region.equityProfile === "Moderate"
      ? "#C68A1D"
      : "#B43C3C";

  const trendPositive = region.registrationTrend >= 0;

  return (
    <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm overflow-hidden">
      {/* Panel Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `2px solid ${ACCENT}20` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: getDensityColor(region.registrations) }}
          />
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1D26" }}>
              {region.name}
            </p>
            <p style={{ fontSize: "11px", color: "#9CA0B0" }}>
              Selected Region Details
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-[#F3F4F6] transition-colors"
        >
          <X size={16} className="text-[#9CA0B0]" />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-0 border-b border-[#F0F1F3]">
        {[
          {
            icon: Users,
            label: "Registrations",
            value: region.registrations.toLocaleString(),
            sub: `Pop. ${(region.population / 1000).toFixed(0)}K`,
          },
          {
            icon: BookOpen,
            label: "Completion",
            value: `${region.completionRate}%`,
            sub: region.dominantTrack,
          },
          {
            icon: Radio,
            label: "Top Channel",
            value: region.strongestChannel,
            sub: region.topProvider,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="px-4 py-3.5 border-r border-[#F0F1F3] last:border-r-0"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={12} className="text-[#9CA0B0]" />
                <span style={{ fontSize: "10.5px", color: "#9CA0B0" }}>
                  {kpi.label}
                </span>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1D26" }}>
                {kpi.value}
              </p>
              <p
                style={{
                  fontSize: "10.5px",
                  color: "#9CA0B0",
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trend + Equity */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#F0F1F3]">
        <div className="flex items-center gap-2">
          {trendPositive ? (
            <TrendingUp size={14} className="text-[#2D8B4E]" />
          ) : (
            <TrendingDown size={14} className="text-[#B43C3C]" />
          )}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: trendPositive ? "#2D8B4E" : "#B43C3C",
            }}
          >
            {trendPositive ? "+" : ""}
            {region.registrationTrend}% MoM
          </span>
        </div>
        <span
          className="px-2.5 py-1 rounded-md"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: equityColor,
            backgroundColor: `${equityColor}12`,
          }}
        >
          {region.equityProfile}
        </span>
      </div>

      {/* Underrepresented Alert */}
      {region.underrepresented && (
        <div className="mx-5 mt-3.5 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#FEF2F0] border border-[#F5D0CA]">
          <AlertTriangle size={13} className="text-[#B43C3C] mt-0.5 flex-shrink-0" />
          <div>
            <span
              style={{ fontSize: "11px", color: "#B43C3C", fontWeight: 600 }}
            >
              Underrepresented Region
            </span>
            <p style={{ fontSize: "10.5px", color: "#B43C3C", opacity: 0.8, marginTop: "2px" }}>
              Below national average in registration density and channel coverage.
              Recommended for targeted outreach.
            </p>
          </div>
        </div>
      )}

      {/* Channel Breakdown mini chart */}
      <div className="px-5 py-4">
        <p
          style={{
            fontSize: "11px",
            color: "#9CA0B0",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 500,
            marginBottom: "10px",
          }}
        >
          Channel Breakdown
        </p>
        <div className="space-y-2">
          {[...region.channels]
            .sort((a, b) => b.count - a.count)
            .map((ch) => {
              const maxCount = Math.max(...region.channels.map((c) => c.count));
              const pct = (ch.count / maxCount) * 100;
              return (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: "11px", color: "#4A4E5F" }}>
                      {ch.name}
                    </span>
                    <span
                      style={{ fontSize: "11px", fontWeight: 500, color: "#1A1D26" }}
                    >
                      {ch.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F0F1F3] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: ACCENT,
                        opacity: 0.4 + (pct / 100) * 0.6,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default function GeographicPage() {
  const [selectedRegionId, setSelectedRegionId] = useState("beirut");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const region = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const hoveredRegionData = hoveredRegion
    ? regions.find((r) => r.id === hoveredRegion) || null
    : null;

  const equityColor =
    region.equityProfile === "Balanced"
      ? "#2D8B4E"
      : region.equityProfile === "Moderate"
      ? "#C68A1D"
      : "#B43C3C";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // National totals for context
  const totalRegistrations = regions.reduce((s, r) => s + r.registrations, 0);
  const underrepCount = regions.filter((r) => r.underrepresented).length;

  return (
    <div className="space-y-6">
      {/* Summary KPI bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total National Registrations",
            value: totalRegistrations.toLocaleString(),
            icon: Users,
          },
          {
            label: "Governorates Covered",
            value: `${regions.length} / 8`,
            icon: MapPin,
          },
          {
            label: "Underrepresented Regions",
            value: `${underrepCount}`,
            icon: AlertTriangle,
            alert: true,
          },
          {
            label: "Avg. Completion Rate",
            value: `${Math.round(regions.reduce((s, r) => s + r.completionRate, 0) / regions.length)}%`,
            icon: BookOpen,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm px-5 py-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon
                  size={14}
                  className={kpi.alert ? "text-[#B43C3C]" : "text-[#9CA0B0]"}
                />
                <span style={{ fontSize: "11px", color: "#9CA0B0" }}>
                  {kpi.label}
                </span>
              </div>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: kpi.alert && underrepCount > 0 ? "#B43C3C" : "#1A1D26",
                }}
              >
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Choropleth Map Section */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1D26",
                marginBottom: "2px",
              }}
            >
              Registration Density Choropleth
            </h3>
            <p style={{ fontSize: "11.5px", color: "#9CA0B0" }}>
              Click a governorate to inspect · Dashed outlines indicate underrepresented
              regions
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          {/* Map */}
          <div className="flex-1 flex flex-col">
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              <LebanonChoroplethMap
                selectedRegion={selectedRegionId}
                onSelect={setSelectedRegionId}
                hoveredRegion={hoveredRegion}
                onHover={setHoveredRegion}
                onMouseMove={handleMouseMove}
              />
            </div>
            <DensityLegend />
          </div>

          {/* Selected Region Detail Panel */}
          <div className="w-[320px] min-w-[320px]">
            <RegionDetailPanel
              region={region}
              onClose={() => setSelectedRegionId("beirut")}
            />
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredRegionData && hoveredRegion !== selectedRegionId && (
        <MapTooltip region={hoveredRegionData} position={mousePos} />
      )}

      {/* Equity Radar + Channel Effectiveness */}
      <div className="grid grid-cols-2 gap-6">
        {/* Equity Radar */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1A1D26",
              marginBottom: "2px",
            }}
          >
            Equity Radar
          </h3>
          <p style={{ fontSize: "11.5px", color: "#9CA0B0", marginBottom: "16px" }}>
            Multi-dimensional equity assessment for {region.name}
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart
              data={region.radar}
              cx="50%"
              cy="50%"
              outerRadius="75%"
            >
              <PolarGrid stroke="#E8E9ED" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 11, fill: "#4A4E5F" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#9CA0B0" }}
              />
              <Radar
                dataKey="value"
                stroke={ACCENT}
                fill={ACCENT}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span style={{ fontSize: "12px", color: "#6B7085" }}>
              Region Equity Profile:
            </span>
            <span
              className="px-2.5 py-1 rounded-md"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: equityColor,
                backgroundColor: `${equityColor}15`,
              }}
            >
              {region.equityProfile}
            </span>
          </div>
        </div>

        {/* Channel Effectiveness by Region */}
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1D26" }}>
              Channel Effectiveness by Region
            </h3>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-[#DDE0E7] bg-white text-[#1A1D26] cursor-pointer"
              style={{ fontSize: "12.5px" }}
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <p
            style={{
              fontSize: "11.5px",
              color: "#9CA0B0",
              marginBottom: "20px",
            }}
          >
            Indicates strongest dissemination partner in selected region.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[...region.channels].sort((a, b) => b.count - a.count)}
              layout="vertical"
              margin={{ left: 90, right: 50, top: 5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0F1F3"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9CA0B0" }}
                axisLine={{ stroke: "#E8E9ED" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#4A4E5F" }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #E8E9ED",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [
  typeof value === "number" ? value.toLocaleString() : String(value),
  "Registrations",
]}
              />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                barSize={22}
                label={{
                  position: "right",
                  fill: "#4A4E5F",
                  fontSize: 11.5,
                  fontWeight: 500,
                  formatter: (v) =>
  typeof v === "number" ? v.toLocaleString() : String(v ?? ""),
                }}
              >
                {[...region.channels]
                  .sort((a, b) => b.count - a.count)
                  .map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
