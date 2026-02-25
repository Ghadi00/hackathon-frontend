import { axios_ } from "../../axios-client/axios-client";
import type { RegisterDto } from "../../dto/auth/register.dto";
import api from "../api";

type LoginDto = {
  email: string;
  password: string;
};

const AuthQfn = {
  register: async (data: RegisterDto): Promise<any> => {
    const res = await axios_<any>({
      method: "POST",
      url: api.auth.register,
      data
    });

    return res.data;
  },

  login: async (data: LoginDto): Promise<any> => {
    const res = await axios_<any>({
      method: "POST",
      url: api.auth.login,
      data,
    });

    return res.data;
  },

  logout: async (): Promise<any> => {
    const res = await axios_<any>({
      method: "POST",
      url: api.auth.logout,
    });

    return res.data;
  },

  getSession: async (): Promise<any> => {
    const res = await axios_<any>({
      method: "GET",
      url: api.auth.session,
    });

    return res.data;
  },
};

export default AuthQfn;
