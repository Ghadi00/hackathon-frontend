import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ROUTES from "../static/routes";
import Layout from "./Layout";
import DisseminationPage from "./DisseminationPage";
import GeographicPage from "./GeographicPage";
import InterestPage from "./InterestPage";
import LearnerProfilePage from "./LearnerProfilePage";

export default function RootLayout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.root} element={<Layout />}>
          <Route index element={<Navigate to={ROUTES.dissemination} replace />} />
          <Route path={ROUTES.dissemination.slice(1)} element={<DisseminationPage />} />
          <Route path={ROUTES.interestStrategy.slice(1)} element={<InterestPage />} />
          <Route path={ROUTES.geographic.slice(1)} element={<GeographicPage />} />
          <Route path={ROUTES.learnerProfiles.slice(1)} element={<LearnerProfilePage />} />
          <Route path="*" element={<Navigate to={ROUTES.dissemination} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
