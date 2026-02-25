import { axios_ } from "../../axios-client/axios-client";
import api from "../api";

const DashboardQfn = {
  getPerformanceRegistrations: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.performance.registrations });
    return res.data;
  },

  getPerformanceCapabilities: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.performance.capabilities });
    return res.data;
  },

  getPerformanceGrowth: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.performance.growth });
    return res.data;
  },

  getInterestAreas: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.interests.areas });
    return res.data;
  },

  getInterestMotivations: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.interests.motivations });
    return res.data;
  },

  getInterestChallenges: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.interests.challenges });
    return res.data;
  },

  getGeographicRegional: async (order: "ascending" | "descending" = "descending"): Promise<any> => {
    const res = await axios_<any>({
      method: "GET",
      url: api.geographic.regional,
      params: { order },
    });
    return res.data;
  },

  getGeographicChannels: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.geographic.channels });
    return res.data;
  },

  getProfilesAdmins: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.profiles.admins });
    return res.data;
  },

  getProfilesDemographics: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.profiles.demographics });
    return res.data;
  },

  getProfilesPrograms: async (): Promise<any> => {
    const res = await axios_<any>({ method: "GET", url: api.profiles.programs });
    return res.data;
  },
};

export default DashboardQfn;
