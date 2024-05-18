import { Route, Routes } from "react-router-dom";
import MainContainer from "../../layout/maincontainer/MainContainer";
import ViewTable from "../view-table/ViewTable";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContainer />}>
        <Route path="/" element={<ViewTable />} />
        <Route path="/view-table" element={<ViewTable />} />
        <Route path="/view-table/:tableId" element={<ViewTable />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
