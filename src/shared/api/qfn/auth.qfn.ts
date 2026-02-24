import { axios_ } from "../../axios-client/axios-client";
import type { RegisterDto } from "../../dto/auth/register.dto";
import api from "../api";

const AuthQfn = {
  register: async (data: RegisterDto): Promise<any> => {
    const res = await axios_<any>({
      method: "POST",
      url: api.auth.register,
      data
    });

    return res.data;
  },
};

export default AuthQfn;
