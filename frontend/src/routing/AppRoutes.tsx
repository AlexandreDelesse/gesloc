import { Navigate, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage";
import CreatePropertyPage from "../pages/CreatePropertyPage";
import PropertyPage from "../pages/PropertyPage";
import { PrivateRoute } from "../components/auth/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route index element={<HomePage />} />
        <Route path="create-property" element={<CreatePropertyPage />} />
        <Route path="property">
          <Route index element={<Navigate to="/" />} />
          <Route path=":id" element={<PropertyPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
