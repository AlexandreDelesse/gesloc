import { Navigate, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage";
import CreatePropertyPage from "../pages/CreatePropertyPage";
import PropertyPage from "../pages/PropertyPage";
import CreateTenancyPage from "../pages/CreateTenancyPage";
import TenancyPage from "../pages/TenancyPage";
import CandidatePage from "../pages/CandidatePage";
import CandidateDetailsPage from "../pages/CandidateDetailsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="create-property" element={<CreatePropertyPage />} />
      <Route path="property">
        <Route index element={<Navigate to="/" />} />
        <Route path=":id" element={<PropertyPage />} />
        <Route path=":id/tenancy/new" element={<CreateTenancyPage />} />
        <Route path=":id/tenancy/:tenancyId" element={<TenancyPage />} />
        <Route path=":id/candidatures/:candidateId" element={<CandidateDetailsPage />} />
      </Route>
      <Route path="candidature/:token" element={<CandidatePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
