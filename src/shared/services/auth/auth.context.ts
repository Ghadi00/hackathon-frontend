import { createContext } from 'react';

import type AuthService from './auth.service';

const AuthSvcContext = createContext<AuthService>(null as any);

export default AuthSvcContext;