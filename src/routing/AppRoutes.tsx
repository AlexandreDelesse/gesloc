import { Navigate, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage";
import CreatePropertyPage from "../pages/CreatePropertyPage";
import PropertyPage from "../pages/PropertyPage";

interface Props {}

function AppRoutes(props: Props) {
  const {} = props;

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="create-property" element={<CreatePropertyPage />} />
      <Route path="property">
        <Route index element={<Navigate to="/" />} />
        <Route path=":id" element={<PropertyPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
