import { useState, useMemo } from "react";
import { Search, X, ChevronRight } from "lucide-react";

interface Learner {
  id: number;
  name: string;
  ageRange: string;
  employment: string;
  jobLevel: string;
  industry: string;
  track: string;
  channel: string;
  entity: string;
  region: string;
  skillLevel: string;
  provider: string;
}

const learners: Learner[] = [
  { id: 1, name: "Ahmad Khoury", ageRange: "25–34", employment: "Employed", jobLevel: "Mid-level", industry: "Finance", track: "GenAI", channel: "University", entity: "USJ", region: "Beirut", skillLevel: "Intermediate", provider: "Microsoft" },
  { id: 2, name: "Carla Nassar", ageRange: "18–24", employment: "Student", jobLevel: "Entry", industry: "Technology", track: "AI Fundamentals", channel: "University", entity: "AUB", region: "Beirut", skillLevel: "Beginner", provider: "Microsoft" },
  { id: 3, name: "Dina Saleh", ageRange: "35–44", employment: "Employed", jobLevel: "Senior", industry: "Healthcare", track: "Data Ethics", channel: "NGO", entity: "Teach For Lebanon", region: "Mount Lebanon", skillLevel: "Advanced", provider: "Oracle" },
  { id: 4, name: "Elie Haddad", ageRange: "25–34", employment: "Self-employed", jobLevel: "Mid-level", industry: "Education", track: "Automation", channel: "Public Sector", entity: "Ministry of Education", region: "North Lebanon", skillLevel: "Intermediate", provider: "Microsoft" },
  { id: 5, name: "Fatima Zein", ageRange: "18–24", employment: "Unemployed", jobLevel: "Entry", industry: "Retail", track: "GenAI", channel: "NGO", entity: "Nawaya Network", region: "South Lebanon", skillLevel: "Beginner", provider: "Not linked" },
  { id: 6, name: "Georges Abou Khalil", ageRange: "45–54", employment: "Employed", jobLevel: "Director", industry: "Manufacturing", track: "Automation", channel: "Employer", entity: "Azadea Group", region: "Mount Lebanon", skillLevel: "Advanced", provider: "Oracle" },
  { id: 7, name: "Hana Mouawad", ageRange: "25–34", employment: "Employed", jobLevel: "Mid-level", industry: "NGO / Dev", track: "Data Ethics", channel: "NGO", entity: "LSESD", region: "Bekaa Valley", skillLevel: "Intermediate", provider: "Microsoft" },
  { id: 8, name: "Ibrahim Fares", ageRange: "35–44", employment: "Employed", jobLevel: "Senior", industry: "Banking", track: "AI Fundamentals", channel: "Employer", entity: "BLOM Bank", region: "Beirut", skillLevel: "Intermediate", provider: "Microsoft" },
  { id: 9, name: "Jana Harb", ageRange: "18–24", employment: "Student", jobLevel: "Entry", industry: "Technology", track: "GenAI", channel: "University", entity: "LAU", region: "Beirut", skillLevel: "Beginner", provider: "Not linked" },
  { id: 10, name: "Karim El-Masri", ageRange: "25–34", employment: "Employed", jobLevel: "Mid-level", industry: "Telecommunications", track: "Cloud Computing", channel: "Employer", entity: "Touch / Alfa", region: "Mount Lebanon", skillLevel: "Intermediate", provider: "Microsoft" },
  { id: 11, name: "Layla Saad", ageRange: "35–44", employment: "Employed", jobLevel: "Senior", industry: "Government", track: "AI Fundamentals", channel: "Public Sector", entity: "Civil Service Board", region: "Nabatieh", skillLevel: "Beginner", provider: "Not linked" },
  { id: 12, name: "Michel Daher", ageRange: "25–34", employment: "Self-employed", jobLevel: "Mid-level", industry: "Media", track: "GenAI", channel: "Syndicate", entity: "Press Syndicate", region: "Beirut", skillLevel: "Advanced", provider: "Oracle" },
];

const CHANNELS = ["All", "University", "NGO", "Public Sector", "Employer", "Syndicate"];
const REGIONS = ["All", "Beirut", "Mount Lebanon", "North Lebanon", "South Lebanon", "Bekaa Valley", "Nabatieh"];
const TRACKS = ["All", "GenAI", "AI Fundamentals", "Data Ethics", "Automation", "Cloud Computing"];
const AGE_RANGES = ["All", "18–24", "25–34", "35–44", "45–54"];
const EMPLOYMENT_STATUS = ["All", "Employed", "Student", "Self-employed", "Unemployed"];
const INDUSTRIES = ["All", "Finance", "Technology", "Healthcare", "Education", "Retail", "Manufacturing", "NGO / Dev", "Banking", "Telecommunications", "Government", "Media"];
const PROVIDERS = ["All", "Microsoft", "Oracle", "Not linked"];
const JOB_LEVELS = ["All", "Entry", "Mid-level", "Senior", "Director"];

const ACCENT = "#3B82A0";

function SkillBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Beginner: { bg: "#EBF4F8", text: "#3B82A0" },
    Intermediate: { bg: "#F0FBF0", text: "#2D8B4E" },
    Advanced: { bg: "#F5F0FA", text: "#7C3AED" },
  };
  const c = colors[level] || { bg: "#F5F5F7", text: "#4A4E5F" };
  return (
    <span className="px-2 py-0.5 rounded-md" style={{ fontSize: '11px', fontWeight: 500, backgroundColor: c.bg, color: c.text }}>
      {level}
    </span>
  );
}

function ProviderBadge({ provider }: { provider: string }) {
  if (provider === "Not linked") {
    return (
      <span className="px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#9CA0B0]" style={{ fontSize: '11px', fontWeight: 500 }}>
        Not linked
      </span>
    );
  }
  const isMicrosoft = provider === "Microsoft";
  return (
    <span
      className="px-2 py-0.5 rounded-md"
      style={{
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: isMicrosoft ? '#EBF0FF' : '#FFF0EB',
        color: isMicrosoft ? '#2563EB' : '#DC5C1A',
      }}
    >
      {provider}
    </span>
  );
}

export default function LearnerProfilesPage() {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [trackFilter, setTrackFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [providerFilter, setProviderFilter] = useState("All");
  const [jobLevelFilter, setJobLevelFilter] = useState("All");

  const filteredLearners = useMemo(() => {
    return learners.filter((l) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(searchLower) ||
        l.entity.toLowerCase().includes(searchLower) ||
        l.track.toLowerCase().includes(searchLower);
      const matchChannel = channelFilter === "All" || l.channel === channelFilter;
      const matchRegion = regionFilter === "All" || l.region === regionFilter;
      const matchTrack = trackFilter === "All" || l.track === trackFilter;
      const matchAge = ageFilter === "All" || l.ageRange === ageFilter;
      const matchEmployment = employmentFilter === "All" || l.employment === employmentFilter;
      const matchIndustry = industryFilter === "All" || l.industry === industryFilter;
      const matchProvider = providerFilter === "All" || l.provider === providerFilter;
      const matchJobLevel = jobLevelFilter === "All" || l.jobLevel === jobLevelFilter;
      return matchSearch && matchChannel && matchRegion && matchTrack && matchAge && matchEmployment && matchIndustry && matchProvider && matchJobLevel;
    });
  }, [search, channelFilter, regionFilter, trackFilter, ageFilter, employmentFilter, industryFilter, providerFilter, jobLevelFilter]);

  const clearFilters = () => {
    setSearch("");
    setChannelFilter("All");
    setRegionFilter("All");
    setTrackFilter("All");
    setAgeFilter("All");
    setEmploymentFilter("All");
    setIndustryFilter("All");
    setProviderFilter("All");
    setJobLevelFilter("All");
  };

  const hasFilters = search || channelFilter !== "All" || regionFilter !== "All" || trackFilter !== "All" || ageFilter !== "All" || employmentFilter !== "All" || industryFilter !== "All" || providerFilter !== "All" || jobLevelFilter !== "All";

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-5 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA0B0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, entity, or track…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#DDE0E7] bg-[#F7F8FA] text-[#1A1D26] placeholder-[#B0B3C0] focus:outline-none focus:border-[#3B82A0] focus:ring-1 focus:ring-[#3B82A0]/20 transition-colors"
              style={{ fontSize: '13px' }}
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: "Channel", value: channelFilter, setter: setChannelFilter, options: CHANNELS },
            { label: "Region", value: regionFilter, setter: setRegionFilter, options: REGIONS },
            { label: "Track", value: trackFilter, setter: setTrackFilter, options: TRACKS },
            { label: "Age Range", value: ageFilter, setter: setAgeFilter, options: AGE_RANGES },
            { label: "Employment Status", value: employmentFilter, setter: setEmploymentFilter, options: EMPLOYMENT_STATUS },
            { label: "Industry", value: industryFilter, setter: setIndustryFilter, options: INDUSTRIES },
            { label: "Provider", value: providerFilter, setter: setProviderFilter, options: PROVIDERS },
            { label: "Job Level", value: jobLevelFilter, setter: setJobLevelFilter, options: JOB_LEVELS },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <label style={{ fontSize: '12px', color: '#6B7085', fontWeight: 500, whiteSpace: 'nowrap' }}>{f.label}:</label>
              <select
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#DDE0E7] bg-white text-[#1A1D26] cursor-pointer focus:outline-none focus:border-[#3B82A0]"
                style={{ fontSize: '13px' }}
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Action buttons */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#6B7085] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              style={{ fontSize: '12.5px', fontWeight: 500 }}
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
        <p style={{ fontSize: '11px', color: '#9CA0B0', marginTop: '8px' }}>
          {hasFilters
            ? `Showing ${filteredLearners.length} of ${learners.length} learners`
            : "Default view shows top 10 learners alphabetically."
          }
        </p>
      </div>

      {/* Results Grid */}
      {filteredLearners.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-12 text-center">
          <p style={{ fontSize: '14px', color: '#6B7085' }}>No learners match the current filters.</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-[#3B82A0] hover:underline cursor-pointer"
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLearners.slice(0, 12).map((learner) => (
            <div
              key={learner.id}
              className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-5 hover:shadow-md hover:border-[#C5D8E0] transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1A1D26', lineHeight: '1.3' }}>
                    {learner.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6B7085', marginTop: '2px' }}>
                    {learner.ageRange} · {learner.employment}
                  </p>
                </div>
                <ProviderBadge provider={learner.provider} />
              </div>

              {/* Details */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[#EBF4F8] text-[#3B82A0]" style={{ fontSize: '11px', fontWeight: 500 }}>
                    {learner.track}
                  </span>
                  <SkillBadge level={learner.skillLevel} />
                  <span className="px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#4A4E5F]" style={{ fontSize: '11px', fontWeight: 500 }}>
                    {learner.jobLevel}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#4A4E5F', lineHeight: '1.6' }}>
                  <p>
                    <span style={{ color: '#9CA0B0' }}>Industry:</span>{" "}
                    <span style={{ fontWeight: 500 }}>{learner.industry}</span>
                  </p>
                  <p>
                    <span style={{ color: '#9CA0B0' }}>Channel:</span>{" "}
                    <span style={{ fontWeight: 500 }}>{learner.channel} — {learner.entity}</span>
                  </p>
                  <p>
                    <span style={{ color: '#9CA0B0' }}>Region:</span>{" "}
                    <span style={{ fontWeight: 500 }}>{learner.region}</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#F0F1F3] flex items-center justify-end">
                <button
                  className="flex items-center gap-1 text-[#3B82A0] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  View details
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}