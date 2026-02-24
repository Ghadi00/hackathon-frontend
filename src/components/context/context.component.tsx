import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

// services

// utils
import AuthService from '../../shared/services/auth/auth.service';
import AuthSvcContext from '../../shared/services/auth/auth.context';
import { appStorage, seshStorage } from '../../shared/app-storage/app-storage';
import queryClient from '../../shared/query-client/query-client';
import UserSvcContext from '../../shared/services/user/user.context';
import UserService from '../../shared/services/user/user.service';

// const logSvc = new LogService();

// const titleSvc = new DocumentTitleService();
// const modalSvc = new ModalService();

const authSvc = new AuthService(appStorage, seshStorage);
const userSvc = new UserService();

// function AppUISvcs({ children }: { children: ReactNode }) {
// 	return (
// 		<DocTitleSvcContext.Provider value={titleSvc}>
// 			{/* <ModalSvcContext.Provider value={modalSvc}>{children}</ModalSvcContext.Provider> */}
// 		</DocTitleSvcContext.Provider>
// 	);
// }

function AppFnSvcs({ children }: { children: ReactNode }) {
    return (
        // <LogSvcContext.Provider value={logSvc}>
        <AuthSvcContext.Provider value={authSvc}>
            <UserSvcContext.Provider value={userSvc}>
                {children}
            </UserSvcContext.Provider>
        </AuthSvcContext.Provider>
        // </LogSvcContext.Provider>
    );
}

type ContextComponentProps = {
    children: ReactNode;
};

export default function ContextComponent({ children }: ContextComponentProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* <AppUISvcs> */}
            <AppFnSvcs>{children}</AppFnSvcs>
            {/* </AppUISvcs> */}
        </QueryClientProvider>
    );
}
