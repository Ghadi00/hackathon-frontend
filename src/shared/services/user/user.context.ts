import { createContext } from 'react';

import UserService from './user.service';

// @ts-expect-error initialized in context component
const UserSvcContext = createContext<UserService>(null);

export default UserSvcContext;
