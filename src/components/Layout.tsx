import { Outlet, NavLink, useLocation } from "react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Lightbulb,
  MapPin,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/dissemination", label: "Dissemination", icon: BarChart3 },
  { to: "/interest-strategy", label: "Interest & Strategy", icon: Lightbulb },
  { to: "/geographic", label: "Geographic", icon: MapPin },
  { to: "/learner-profiles", label: "Learner Profiles", icon: Users },
];

const pageTitles: Record<string, string> = {
  "/": "Dissemination Performance",
  "/dissemination": "Dissemination Performance",
  "/interest-strategy": "Interest & Strategy Insights",
  "/geographic": "Geographic Insights",
  "/learner-profiles": "Unified Learner Profiles",
};

export default function Layout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className="flex h-screen w-full bg-[#F7F8FA]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-[#E8E9ED] flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[232px] min-w-[232px]" : "w-0 min-w-0"
        }`}
        style={{ overflow: isSidebarOpen ? "visible" : "hidden" }}
      >
        <div className="px-6 py-6 border-b border-[#E8E9ED]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B82A0] flex items-center justify-center">
              <span className="text-white" style={{ fontSize: "14px", fontWeight: 700 }}>
                N
              </span>
            </div>
            <div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1D26" }}>NUMŪ</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7085",
                  marginLeft: "4px",
                }}
              >
                Analytics
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to === "/dissemination" && location.pathname === "/");

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#EBF4F8] text-[#3B82A0]"
                    : "text-[#6B7085] hover:bg-[#F3F4F6] hover:text-[#1A1D26]"
                }`}
                style={{ fontSize: "13.5px", fontWeight: isActive ? 500 : 400 }}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#E8E9ED]">
          <p style={{ fontSize: "11px", color: "#9CA0B0" }}>v2.4.1 · NUMŪ Platform</p>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-[50%] -translate-y-1/2 z-50 bg-white border border-[#E8E9ED] rounded-r-lg shadow-sm hover:bg-[#F7F8FA] transition-all duration-300 ease-in-out"
        style={{
          left: isSidebarOpen ? "232px" : "0px",
          padding: "12px 6px",
        }}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeft size={18} className="text-[#6B7085]" />
        ) : (
          <ChevronRight size={18} className="text-[#6B7085]" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[56px] min-h-[56px] bg-white border-b border-[#E8E9ED] flex items-center justify-between px-8">
          <h1
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#1A1D26",
              lineHeight: "1.2",
            }}
          >
            {pageTitle}
          </h1>

          <div className="flex items-center gap-4">
            <span style={{ fontSize: "12px", color: "#9CA0B0" }}>
              Last updated: Feb 25, 2026 · 09:42 AM
            </span>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#DDE0E7] text-[#4A4E5F] hover:bg-[#F3F4F6] transition-colors"
              style={{ fontSize: "12.5px", fontWeight: 500 }}
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
  <div className="text-black">Layout is working</div>
</main>
      </div>
    </div>
  );
}