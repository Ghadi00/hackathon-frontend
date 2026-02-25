import { Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import ROUTES from "../static/routes";
import { ToastContainer } from "react-toastify";
import ContextComponent from "../components/context/context.component";
import AuthSvcContext from "../shared/services/auth/auth.context";
import type AuthService from "../shared/services/auth/auth.service";
import AppInit from "../components/app-init/app-init.component";
import LoadingComponent from "../components/internal/loading/loading.component";
import HomePage from "./home/home.page";

/* ----------------------------- Auth Guard ----------------------------- */
function AuthGuard() {
    const authSvc = useContext<AuthService>(AuthSvcContext);
    if (!authSvc.isLoggedIn()) return <Navigate to={ROUTES.root} />;
    return <Outlet />;
}

/* ---------------------------- Scroll To Top ---------------------------- */

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => window.scrollTo(0, 0), [pathname]);
    return null;
}

/* ------------------------------- Modals -------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
    // [APP_MODALS.EXAMPLE_MODAL]: ExampleModal,
};

function AppModals() {
    // const modalSvc = useContext<ModalService>(ModalSvcContext);
    // return (
    // 	<ModalContainer>
    // 		<Suspense fallback={<div />}>
    // 			{modalSvc.getOpenModals().map((modal: ModalData, idx: number) => {
    // 				const ModalComp = MODAL_COMPONENTS[modal.id];
    // 				return ModalComp ? (
    // 					<ModalComp key={idx} modalId={modal.id} data={modal.data} />
    // 				) : null;
    // 			})}
    // 		</Suspense>
    // 	</ModalContainer>
    // );
}

/* ----------------------------- Routing Tree ---------------------------- */

function RoutingComponent() {
    return (
        <Routes>
            {/* Private (requires auth) */}
            <Route element={<AuthGuard />}>
            </Route>

            <Route path={"*"} element={<HomePage />} />
        </Routes>
    );
}

/* --------------------------------- Root -------------------------------- */

export default function RootLayout() {
    return (
        <ContextComponent>
            <AppInit>
                {/* <SidebarProvider> */}
                <BrowserRouter>
                    <Suspense fallback={<LoadingComponent message="Loading" />}>
                        <RoutingComponent />
                    </Suspense>

                    <ScrollToTop />

                    <ToastContainer
                        position="top-right"
                        theme="white"
                        hideProgressBar
                        autoClose={5000}
                        className="py-1 my-0"
                        toastClassName="min-h-[40px]"
                    />
                </BrowserRouter>
                {/* </SidebarProvider> */}
            </AppInit>
        </ContextComponent>
    );
}
